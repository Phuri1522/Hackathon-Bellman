import "leaflet/dist/leaflet.css"
import { divIcon } from "leaflet"
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
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
}

const BANGKOK_LOCATION: MapPoint = {
  lat: 13.7563,
  lng: 100.5018,
}

const defaultCenter: [number, number] = [BANGKOK_LOCATION.lat, BANGKOK_LOCATION.lng]

const mutantIcon = divIcon({
  className: "",
  html: `<div style="
    height:18px;
    width:18px;
    border-radius:9999px;
    background:#b7410e;
    border:2px solid #050505;
    box-shadow:0 0 18px #b7410e;
    cursor:pointer;
  "></div>`,
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

export type HunterMapHandle = {
  flyTo: (lat: number, lng: number, zoom: number) => void
  selectPost: (post: MutantHuntingRequest) => void
}

type FlyToHandle = { flyTo: (lat: number, lng: number, zoom: number) => void }

function MapFlyController({ innerRef }: { innerRef: React.Ref<FlyToHandle> }) {
  const map = useMap()
  useImperativeHandle(innerRef, () => ({
    flyTo(lat, lng, zoom) {
      map.flyTo([lat, lng], zoom)
    },
  }))
  return null
}

function SelectedPostMapController({
  focusTarget,
  focusRequest,
}: {
  marker: MapMarkerData;
  isHunter: boolean;
  onClose: () => void;
  onViewPost: (id: number) => void;
}) {
  const map = useMap();
  const [pos, setPos] = useState(() =>
    map.latLngToContainerPoint([marker.latitude, marker.longitude])
  );

  // อัพเดทตำแหน่ง overlay ตามเมื่อ map ขยับ/ซูม
  function update() {
    setPos(map.latLngToContainerPoint([marker.latitude, marker.longitude]));
  }

  useEffect(() => {
    update();
  }, [marker.latitude, marker.longitude]);

  useMapEvents({ move: update, zoom: update, resize: update });

  const fallbackImage =
    "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400";
  const image = marker.picture || fallbackImage;
  const title = `${marker.mutantType} ${marker.animalType}`;

  return (
    // ใช้ pointer-events-none บน container หลักเพื่อไม่ให้บัง map
    // แต่ pointer-events-auto บน card เพื่อให้กดได้
    <div
      className="pointer-events-none absolute z-[500]"
      style={{
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, calc(-100% - 20px))",
      }}
    >
      {/* Card ── ใช้ design เดียวกับ PostPinOverlay ของเพื่อน */}
      <div className="pointer-events-auto w-52 rounded-xl border border-[#2d3748] bg-[#0f1115] p-3 text-[#e5e7eb] shadow-[0_0_18px_rgba(57,255,20,0.25)] transition-all duration-200 hover:border-[#39ff14]">
        
        {/* ปุ่มปิด */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1a1f2e] text-xs text-[#9ca3af] hover:text-white"
        >
          ✕
        </button>

        {/* รูปภาพ */}
        <img
          src={image}
          alt={title}
          className="h-28 w-full rounded-lg object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />

        {/* ชื่อ mutant ── เขียวเรือง เหมือน design เดิม */}
        <h2 className="mt-3 text-center text-lg font-bold text-[#39ff14]">
          {title}
        </h2>

        {/* รายละเอียด */}
        <div className="mt-2 space-y-1 text-xs">
          <p>
            <span className="text-[#9ca3af]">Class: </span>
            <span className="text-[#e5e7eb]">{marker.classRequired}</span>
          </p>
          {marker.reward && (
            <p className="font-semibold text-[#39ff14]">
              Reward: {marker.reward}
            </p>
          )}
          {marker.description && (
            <p className="line-clamp-2 text-[#9ca3af]">{marker.description}</p>
          )}
        </div>

        {/* ปุ่ม Hunt! โชว์เฉพาะ Hunter */}
        {isHunter && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewPost(marker.id);
            }}
            className="mt-3 w-full rounded bg-red-600 py-1 text-sm font-bold text-white transition hover:bg-red-700"
          >
            Hunt!
          </button>
        )}
      </div>

      {/* Arrow ชี้ลงหา marker */}
      <div
        className="mx-auto h-0 w-0"
        style={{
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: "8px solid #2d3748",
        }}
      />
    </div>
  )
}

const HunterMap = forwardRef<HunterMapHandle, HunterMapProps>(function HunterMap({ role = "hunter" }, ref) {
  const flyRef = useRef<FlyToHandle>(null)
  const location = useLocation()
  const [posts, setPosts] = useState<MutantHuntingRequest[]>([])
  const [selectedPost, setSelectedPost] = useState<MutantHuntingRequest | null>(null)
  const [showMiniOverlay, setShowMiniOverlay] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [userLocation, setUserLocation] = useState<MapPoint>(BANGKOK_LOCATION)
  const [focusRequest, setFocusRequest] = useState(0)
  const [focusTarget, setFocusTarget] = useState<MapPoint | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  useImperativeHandle(ref, () => ({
    flyTo(lat, lng, zoom) {
      flyRef.current?.flyTo(lat, lng, zoom)
    },
    selectPost(post) {
      setSelectedPost(post)
      setShowMiniOverlay(true)
      setShowDetails(true)
    },
  }))

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
    const intervalId = window.setInterval(loadPosts, 8000)

    return () => {
      window.removeEventListener("focus", loadPosts)
      window.removeEventListener("mutant-hunting-request-created", loadPosts)
      window.clearInterval(intervalId)
    }
  }, [loadPosts])

  useEffect(() => {
    let isFirstFetch = true;

    const fetchMarkers = async () => {
      try {
        // แสดง loading spinner เฉพาะครั้งแรก ครั้งถัดไป update เงียบๆ
        if (isFirstFetch) setLoading(true);
        const data = await getMapMarkers();
        setMarkers(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching map markers:", err);
        // แสดง error เฉพาะครั้งแรก ไม่ให้ทำลาย UX ระหว่าง poll
        if (isFirstFetch) setError("ไม่สามารถโหลดข้อมูล Post บน Map ได้");
      } finally {
        if (isFirstFetch) {
          setLoading(false);
          isFirstFetch = false;
        }
      }
    };

    fetchMarkers();
    const interval = setInterval(fetchMarkers, 3000);

    // cleanup เมื่อ component unmount
    return () => clearInterval(interval);
  }, []);

  // นำ Hunter ไปหน้า HuntRoomDetails เมื่อกด Hunt!
  const handleViewPost = (postId: number) => {
    window.location.href = `/hunter/hunt-room/${postId}`;
  };

  return (
    <div className="relative w-full h-full">
      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-[#050505]/80">
          <p className="font-mono text-sm text-[#39ff14] animate-pulse">
            [ LOADING MAP DATA... ]
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute top-4 left-1/2 z-[999] -translate-x-1/2 rounded border border-red-600/50 bg-[#0f1115] px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className={`relative ${showDetails ? "h-[42vh] w-full md:h-full md:w-[60%]" : "h-full w-full"}`}>
        <button
          onClick={() => flyRef.current?.flyTo(userLocation.lat, userLocation.lng, 15)}
          className="absolute bottom-5 right-5 z-500 bg-[#0f1115] border border-[#39ff14] text-[#39ff14] rounded px-3 py-2 text-xs hover:bg-[#39ff1415] transition-colors shadow-lg"
          style={{ fontFamily: "Orbitron, monospace" }}
        >
          ◎ ME
        </button>
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
          <MapFlyController innerRef={flyRef} />
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
            />
          )}
        </section>
      )}
    </div>
  )
})

export default HunterMap
