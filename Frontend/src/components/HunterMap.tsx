import "leaflet/dist/leaflet.css"
import { divIcon } from "leaflet"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet"
import PostPinOverlay from "../modules/MutantHuntingRequestSystem/components/PostPinOverlay"
import UserPostDetails from "../modules/MutantHuntingRequestSystem/components/UserPostDetails"
import HunterPostDetails from "../modules/MutantHuntingRequestSystem/components/HunterPostDetails"
import {
  acceptMutantHuntingRequest,
  deleteMutantHuntingRequest,
  getMutantHuntingRequests,
} from "../modules/MutantHuntingRequestSystem/mutantHunting.api"
import type {
  MapPoint,
  MutantHuntingRequest,
} from "../modules/MutantHuntingRequestSystem/types/mutantHunting.type"

type Role = "user" | "hunter"

type HunterMapProps = {
  role?: Role
  hunterId?: number
  hasActiveTask?: boolean
  onRequestsChanged?: () => void
}

const ACTIVE_TASK_MESSAGE = "Complete your current task before accepting another match."

const BANGKOK_LOCATION: MapPoint = {
  lat: 13.7563,
  lng: 100.5018,
}

const defaultCenter: [number, number] = [BANGKOK_LOCATION.lat, BANGKOK_LOCATION.lng]

const mutantIcon = divIcon({
  className: "",
  html: '<div style="height:18px;width:18px;border-radius:9999px;background:#b7410e;border:2px solid #050505;box-shadow:0 0 18px #b7410e;"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const userLocationIcon = divIcon({
  className: "",
  html: '<div style="height:16px;width:16px;border-radius:9999px;background:#39ff14;border:2px solid #050505;box-shadow:0 0 18px #39ff14;"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

function getPostTitle(post: MutantHuntingRequest) {
  return `${post.mutantType} ${post.animalType}`
}

function toRadians(value: number) {
  return (value * Math.PI) / 180
}

function calculateDistanceKm(from: MapPoint, to: MapPoint) {
  const earthRadiusKm = 6371
  const latDistance = toRadians(to.lat - from.lat)
  const lngDistance = toRadians(to.lng - from.lng)
  const fromLat = toRadians(from.lat)
  const toLat = toRadians(to.lat)

  const haversine =
    Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
    Math.cos(fromLat) *
      Math.cos(toLat) *
      Math.sin(lngDistance / 2) *
      Math.sin(lngDistance / 2)

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

function MapClickCloser({ onClose }: { onClose: () => void }) {
  useMapEvents({
    click() {
      onClose()
    },
  })

  return null
}

function SelectedPostMapController({
  focusTarget,
  focusRequest,
}: {
  focusTarget: MapPoint | null
  focusRequest: number
}) {
  const map = useMap()

  useEffect(() => {
    if (!focusTarget || focusRequest === 0) return

    map.flyTo([focusTarget.lat, focusTarget.lng], Math.max(map.getZoom(), 15))
  }, [focusRequest, focusTarget, map])

  return null
}

function InitialUserLocationController({ userLocation }: { userLocation: MapPoint }) {
  const map = useMap()
  const [hasCenteredOnUser, setHasCenteredOnUser] = useState(false)

  useEffect(() => {
    if (hasCenteredOnUser) return

    map.setView([userLocation.lat, userLocation.lng], Math.max(map.getZoom(), 15))
    setHasCenteredOnUser(true)
  }, [hasCenteredOnUser, map, userLocation])

  return null
}

function PostOverlayMarker({
  post,
  isVisible,
  onOverlayClick,
}: {
  post: MutantHuntingRequest
  isVisible: boolean
  onOverlayClick: () => void
}) {
  const map = useMap()
  const [position, setPosition] = useState(() =>
    map.latLngToContainerPoint([post.latitude, post.longitude])
  )

  function updatePosition() {
    setPosition(map.latLngToContainerPoint([post.latitude, post.longitude]))
  }

  useEffect(() => {
    updatePosition()
  }, [post.latitude, post.longitude])

  useMapEvents({
    move: updatePosition,
    resize: updatePosition,
    zoom: updatePosition,
  })

  return (
    <div
      className={
        isVisible
          ? "pointer-events-auto absolute z-[500] -translate-x-1/2 -translate-y-[calc(100%+34px)] opacity-100 transition-opacity duration-200"
          : "pointer-events-none absolute z-[500] -translate-x-1/2 -translate-y-[calc(100%+34px)] opacity-0 transition-opacity duration-200"
      }
      style={{ left: position.x, top: position.y }}
    >
      <PostPinOverlay
        mode="preview"
        image={post.picture ?? post.imageUrl ?? null}
        title={getPostTitle(post)}
        onViewPost={(event) => {
          event.stopPropagation()
          onOverlayClick()
        }}
      />
    </div>
  )
}

export default function HunterMap({
  role = "hunter",
  hunterId,
  hasActiveTask = false,
  onRequestsChanged,
}: HunterMapProps) {
  const location = useLocation()
  const [posts, setPosts] = useState<MutantHuntingRequest[]>([])
  const [selectedPost, setSelectedPost] = useState<MutantHuntingRequest | null>(null)
  const [showMiniOverlay, setShowMiniOverlay] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [userLocation, setUserLocation] = useState<MapPoint>(BANGKOK_LOCATION)
  const [focusRequest, setFocusRequest] = useState(0)
  const [focusTarget, setFocusTarget] = useState<MapPoint | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const [hasResolvedInitialLocation, setHasResolvedInitialLocation] = useState(false)

  const selectedPostDistance = useMemo(() => {
    if (!selectedPost) return "0.0 km"

    return `${calculateDistanceKm(userLocation, {
      lat: selectedPost.latitude,
      lng: selectedPost.longitude,
    }).toFixed(1)} km`
  }, [selectedPost, userLocation])

  const loadPosts = useCallback(() => {
    getMutantHuntingRequests()
      .then((requests) => {
        setPosts(requests.filter((request) => request.status === "PUBLIC"))
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    loadPosts()
  }, [loadPosts, location.key])

  useEffect(() => {
    const state = location.state as { notification?: string } | null
    if (!state?.notification) return

    setNotification(state.notification)
    const timeoutId = window.setTimeout(() => {
      setNotification(null)
    }, 2500)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [location.state])

  useEffect(() => {
    window.addEventListener("focus", loadPosts)
    window.addEventListener("mutant-hunting-request-created", loadPosts)
    const intervalId = window.setInterval(loadPosts, 15000)

    return () => {
      window.removeEventListener("focus", loadPosts)
      window.removeEventListener("mutant-hunting-request-created", loadPosts)
      window.clearInterval(intervalId)
    }
  }, [loadPosts])

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation(BANGKOK_LOCATION)
      setHasResolvedInitialLocation(true)
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setHasResolvedInitialLocation(true)
      },
      () => {
        setUserLocation(BANGKOK_LOCATION)
        setHasResolvedInitialLocation(true)
      },
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  function handleMapSpaceClick() {
    setShowMiniOverlay(false)
    setShowDetails(false)
  }

  function handlePostMarkerClick(post: MutantHuntingRequest) {
    setSelectedPost(post)
    setShowMiniOverlay(true)
    setShowDetails(true)
  }

  function handleViewMap() {
    if (!selectedPost) return

    setFocusTarget({
      lat: selectedPost.latitude,
      lng: selectedPost.longitude,
    })
    setFocusRequest((current) => current + 1)
  }

  async function handleDeleteSelectedPost() {
    if (!selectedPost || isDeleting) return

    setIsDeleting(true)

    try {
      await deleteMutantHuntingRequest(selectedPost.id, selectedPost.userId)
      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== selectedPost.id)
      )
      setSelectedPost(null)
      setShowMiniOverlay(false)
      setShowDetails(false)
      setNotification("Post deleted successfully")
      setTimeout(() => {
        setNotification(null)
      }, 2000)
    } catch (error) {
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleApplySelectedPost() {
    if (!selectedPost || !hunterId || isApplying) return
    if (hasActiveTask) {
      setNotification(ACTIVE_TASK_MESSAGE)
      setTimeout(() => {
        setNotification(null)
      }, 2500)
      return
    }

    setIsApplying(true)

    try {
      await acceptMutantHuntingRequest(selectedPost.id, hunterId)
      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== selectedPost.id)
      )
      setSelectedPost(null)
      setShowMiniOverlay(false)
      setShowDetails(false)
      setNotification("Room applied")
      onRequestsChanged?.()
      setTimeout(() => {
        setNotification(null)
      }, 2000)
    } catch (error) {
      console.error(error)
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="flex h-full w-full flex-col bg-[#050505] text-[#e5e7eb] md:flex-row">
      {notification && (
        <div className="fixed left-1/2 top-5 z-[1000] -translate-x-1/2 rounded border border-[#39ff14] bg-[#0f1115] px-5 py-3 text-sm text-[#39ff14] shadow-[0_0_14px_rgba(57,255,20,0.35)]">
          {notification}
        </div>
      )}

      <div className={showDetails ? "h-[42vh] w-full md:h-full md:w-[60%]" : "h-full w-full"}>
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom
          zoomControl
          attributionControl={false}
          className="h-full w-full"
        >
          <SelectedPostMapController
            focusTarget={focusTarget}
            focusRequest={focusRequest}
          />
          {hasResolvedInitialLocation && (
            <InitialUserLocationController userLocation={userLocation} />
          )}
          <MapClickCloser onClose={handleMapSpaceClick} />

          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
            <Tooltip direction="top" offset={[0, -8]}>
              Your location
            </Tooltip>
          </Marker>

          {posts.map((post) => (
            <Marker
              key={post.id}
              position={[post.latitude, post.longitude]}
              icon={mutantIcon}
              eventHandlers={{
                click(event) {
                  event.originalEvent.stopPropagation()
                  handlePostMarkerClick(post)
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -8]}>
                {getPostTitle(post)}
              </Tooltip>
            </Marker>
          ))}

          {selectedPost && (
            <PostOverlayMarker
              post={selectedPost}
              isVisible={showMiniOverlay}
              onOverlayClick={() => {
                setShowMiniOverlay(true)
                setShowDetails(true)
              }}
            />
          )}
        </MapContainer>
      </div>

      {showDetails && selectedPost && (
        <section className="h-[58vh] w-full animate-[fadeInRight_0.25s_ease-out] overflow-y-auto bg-[#0f1115] px-5 py-5 md:h-full md:w-[40%] md:px-10 md:py-6">
          {role === "user" ? (
            <UserPostDetails
              post={selectedPost}
              distance={selectedPostDistance}
              onViewMap={handleViewMap}
              onDelete={handleDeleteSelectedPost}
            />
          ) : (
            <HunterPostDetails
              post={selectedPost}
              distance={selectedPostDistance}
              onViewMap={handleViewMap}
              onApply={handleApplySelectedPost}
              isApplying={isApplying}
              applyDisabled={hasActiveTask}
              applyDisabledMessage={hasActiveTask ? ACTIVE_TASK_MESSAGE : undefined}
            />
          )}
        </section>
      )}
    </div>
  )
}
