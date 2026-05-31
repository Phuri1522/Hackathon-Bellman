import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import SidebarLayout from "../components/SidebarLayout"
import UserSidebar from "../components/Usersidebar"
import HunterSidebar from "../components/Huntersidebar"
import HunterMap from "../components/HunterMap"
import {
  acceptMutantHuntingRequest,
  completeMutantHuntingRequest,
  getMutantHuntingRequests,
} from "../modules/MutantHuntingRequestSystem/mutantHunting.api"
import type {
  MapPoint,
  MutantHuntingRequest,
} from "../modules/MutantHuntingRequestSystem/types/mutantHunting.type"

const BANGKOK_LOCATION: MapPoint = {
  lat: 13.7563,
  lng: 100.5018,
}

const getAutoMatchStorageKey = (hunterId: number) => `hunter-auto-match-${hunterId}`

function getStoredAutoMatchValue(hunterId?: number) {
  if (!hunterId || typeof window === "undefined") return null

  const storedValue = window.localStorage.getItem(getAutoMatchStorageKey(hunterId))
  if (storedValue === "true") return true
  if (storedValue === "false") return false

  return null
}

function getStoredAutoMatch(hunterId?: number, fallback = false) {
  return getStoredAutoMatchValue(hunterId) ?? fallback
}

const ANIMAL_WEIGHTS: Record<string, number> = {
  WOLF: 10,
  BEAR: 10,
  SHARK: 8,
  BOAR: 7,
  SNAKE: 7,
  LIZARD: 6,
  BIRD: 6,
  CAT: 2,
  SPIDER: 5,
  MONKEY: 3,
}

const MUTANT_WEIGHTS: Record<string, number> = {
  SHADOW: 5,
  POISON: 4,
  ELECTRIC: 3,
  ICE: 2,
  FIRE: 3,
}

interface Post {
  id: number
  animalType: string
  mutantType: string
  classRequired: string
  distance?: string
  reward?: string
  status: string
}

interface Request {
  id: number
  animalType: string
  mutantType: string
  status: string
  classRequired: string
  reward?: string
  distance?: string
  picture?: string | null
  imageUrl?: string | null
  createdAt?: string
}

interface Summary {
  id: number
  animalType: string
  mutantType: string
  classRequired: string
  distance?: string
  reward?: string
  powerScore?: number
  completedAt?: string
}

function getWeekStart(date: Date) {
  const weekStart = new Date(date)
  weekStart.setHours(0, 0, 0, 0)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  return weekStart
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

function getDistanceLabel(from: MapPoint, request: MutantHuntingRequest) {
  return `${calculateDistanceKm(from, {
    lat: request.latitude,
    lng: request.longitude,
  }).toFixed(1)} km`
}

function calculateMissionPowerScore(animalType: string, mutantType: string) {
  const animalWeight = ANIMAL_WEIGHTS[animalType.trim().toUpperCase()] ?? 1
  const mutantWeight = MUTANT_WEIGHTS[mutantType.trim().toUpperCase()] ?? 1

  return animalWeight * mutantWeight
}

function getAcceptedHuntForHunter(request: MutantHuntingRequest, hunterId: number) {
  return request.huntRequests?.find((huntRequest) => huntRequest.hunterId === hunterId)
}

function matchesHunter(request: MutantHuntingRequest, hunterId: number) {
  const directHunterId = request.hunterId ?? request.acceptedById
  const hasDirectHunter = directHunterId !== null && directHunterId !== undefined
  const hasHuntRequestHunter = request.huntRequests?.some(
    (huntRequest) => huntRequest.hunterId !== null && huntRequest.hunterId !== undefined
  )

  if (hasDirectHunter) return directHunterId === hunterId
  if (hasHuntRequestHunter) return Boolean(getAcceptedHuntForHunter(request, hunterId))

  return true
}

function getAcceptedDate(request: MutantHuntingRequest, hunterId: number) {
  const huntRequest = getAcceptedHuntForHunter(request, hunterId)
  return (
    request.acceptedAt ??
    huntRequest?.acceptedAt ??
    request.updatedAt ??
    huntRequest?.updatedAt ??
    request.createdAt ??
    huntRequest?.createdAt
  )
}

function isCurrentWeek(request: MutantHuntingRequest, hunterId: number) {
  const acceptedDate = getAcceptedDate(request, hunterId)
  if (!acceptedDate) return true

  const parsedDate = new Date(acceptedDate)
  if (Number.isNaN(parsedDate.getTime())) return true

  return parsedDate >= getWeekStart(new Date())
}

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isHunter = user?.accountType === "HUNTER"

  const [posts, setPosts] = useState<Post[]>([])
  const [matchmakingRequests, setMatchmakingRequests] = useState<Request[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [summary, setSummary] = useState<Summary[]>([])
  const [userLocation, setUserLocation] = useState<MapPoint>(BANGKOK_LOCATION)
  const [deniedMatchIds, setDeniedMatchIds] = useState<number[]>([])
  const [hunterData, setHunterData] = useState({
    autoMatch: getStoredAutoMatch(user?.hunter?.id, user?.hunter?.autoMatch ?? false),
    rank: user?.hunter?.rank ?? "D",
    rankScore: user?.hunter?.rankScore ?? 0,
  })

  const loadHunterProfile = useCallback((hunterId: number) => {
    api.get(`/api/hunters/${hunterId}`)
      .then((res) => {
        const storedAutoMatch = getStoredAutoMatchValue(hunterId)
        const backendAutoMatch =
          typeof res.data.autoMatch === "boolean" ? res.data.autoMatch : null
        const autoMatch = storedAutoMatch ?? backendAutoMatch

        setHunterData((current) => ({
          autoMatch: autoMatch ?? current.autoMatch,
          rank: res.data.rank,
          rankScore: res.data.rankScore,
        }))

        if (storedAutoMatch === null && backendAutoMatch !== null) {
          window.localStorage.setItem(
            getAutoMatchStorageKey(hunterId),
            String(backendAutoMatch)
          )
        }
      })
      .catch(console.error)
  }, [])

  const loadHunterSummary = useCallback((hunterId: number) => {
    getMutantHuntingRequests()
      .then((all) => {
        const hunterClass = user?.hunter?.class ?? "Fighter"
        const normalizedHunterClass = hunterClass.trim().toLowerCase()
        const now = Date.now()
        const matchmaking = hunterData.autoMatch
          ? all.filter((request) => {
              const createdAt = request.createdAt ? new Date(request.createdAt).getTime() : now
              const secondsElapsed = (now - createdAt) / 1000
              const requiredClasses = request.classRequired
                .split(",")
                .map((item) => item.trim().toLowerCase())

              return (
                request.status === "MATCHMAKING" &&
                secondsElapsed < 60 &&
                !deniedMatchIds.includes(request.id) &&
                requiredClasses.includes(normalizedHunterClass)
              )
            })
          : []
        const activeTasks = all.filter(
          (request) =>
            (request.status === "ACCEPTED" || request.status === "IN_PROGRESS") &&
            matchesHunter(request, hunterId)
        )
        const completed = all.filter(
          (request) =>
            request.status === "COMPLETED" &&
            matchesHunter(request, hunterId) &&
            isCurrentWeek(request, hunterId)
        )

        setMatchmakingRequests(matchmaking.map((request) => ({
          id: request.id,
          animalType: request.animalType,
          mutantType: request.mutantType,
          status: request.status,
          classRequired: request.classRequired ?? "",
          reward: request.reward ?? undefined,
          distance: getDistanceLabel(userLocation, request),
          picture: request.picture,
          imageUrl: request.imageUrl,
          createdAt: request.createdAt,
        })))

        setRequests(activeTasks.map((request) => ({
          id: request.id,
          animalType: request.animalType,
          mutantType: request.mutantType,
          status: request.status,
          classRequired: request.classRequired ?? "",
          reward: request.reward ?? undefined,
          distance: getDistanceLabel(userLocation, request),
          picture: request.picture,
          imageUrl: request.imageUrl,
        })))

        setSummary(completed.map((request) => ({
          id: request.id,
          animalType: request.animalType,
          mutantType: request.mutantType,
          classRequired: request.classRequired ?? "",
          reward: request.reward ?? undefined,
          powerScore: calculateMissionPowerScore(request.animalType, request.mutantType),
        })))
      })
      .catch(console.error)
  }, [deniedMatchIds, hunterData.autoMatch, user, userLocation])

  const handleAutoMatchChange = useCallback((next: boolean) => {
    if (user?.hunter?.id) {
      window.localStorage.setItem(getAutoMatchStorageKey(user.hunter.id), String(next))
    }

    setHunterData((current) => ({
      ...current,
      autoMatch: next,
    }))
  }, [user])

  const handleAcceptMatchmaking = useCallback((taskId: number) => {
    if (!user?.hunter) return
    if (requests.some((request) => request.status === "ACCEPTED" || request.status === "IN_PROGRESS")) {
      return
    }

    acceptMutantHuntingRequest(taskId, user.hunter.id)
      .then(() => {
        setMatchmakingRequests((current) =>
          current.filter((request) => request.id !== taskId)
        )
        loadHunterSummary(user.hunter!.id)
        loadHunterProfile(user.hunter!.id)
      })
      .catch(console.error)
  }, [loadHunterProfile, loadHunterSummary, requests, user])

  const handleDenyMatchmaking = useCallback((taskId: number) => {
    setDeniedMatchIds((current) =>
      current.includes(taskId) ? current : [...current, taskId]
    )
    setMatchmakingRequests((current) =>
      current.filter((request) => request.id !== taskId)
    )
  }, [])

  const handleFinishTask = useCallback((taskId: number) => {
    if (!user?.hunter) return

    completeMutantHuntingRequest(taskId, user.hunter.id)
      .then(() => {
        loadHunterSummary(user.hunter!.id)
        loadHunterProfile(user.hunter!.id)
      })
      .catch(console.error)
  }, [loadHunterProfile, loadHunterSummary, user])

  const loadUserPosts = useCallback(() => {
    if (!user || isHunter) return

    api.get(`/api/mutant-hunting-requests`)
      .then((res) => {
        const all = res.data.data ?? []
        const mine = all.filter((p: any) => p.userId === user.id)
        setPosts(mine.map((p: any) => ({
          id: p.id,
          animalType: p.animalType,
          mutantType: p.mutantType,
          classRequired: p.classRequired,
          reward: p.reward,
          status: p.status,
        })))
      })
      .catch(console.error)
  }, [isHunter, user])

  useEffect(() => {
    loadUserPosts()
  }, [loadUserPosts])

  useEffect(() => {
    if (!isHunter || !user?.hunter) return

    const hunterId = user.hunter.id

    setHunterData((current) => ({
      ...current,
      autoMatch: getStoredAutoMatch(hunterId, user.hunter!.autoMatch ?? current.autoMatch),
      rank: user.hunter!.rank ?? current.rank,
      rankScore: user.hunter!.rankScore ?? current.rankScore,
    }))

    loadHunterProfile(hunterId)
  }, [isHunter, loadHunterProfile, user])

  useEffect(() => {
    if (!isHunter || !user?.hunter) return

    loadHunterSummary(user.hunter.id)
  }, [isHunter, loadHunterSummary, user])

  useEffect(() => {
    if (!isHunter || !user?.hunter) return

    const intervalId = window.setInterval(() => {
      loadHunterSummary(user.hunter!.id)
    }, 15000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isHunter, loadHunterSummary, user])

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation(BANGKOK_LOCATION)
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => {
        setUserLocation(BANGKOK_LOCATION)
      },
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  if (!user) return null

  const hasActiveTask = requests.some(
    (request) => request.status === "ACCEPTED" || request.status === "IN_PROGRESS"
  )

  return (
    <SidebarLayout
      map={
        <HunterMap
          role={isHunter ? "hunter" : "user"}
          hunterId={user.hunter?.id}
          hasActiveTask={hasActiveTask}
          onRequestsChanged={
            user.hunter ? () => loadHunterSummary(user.hunter!.id) : loadUserPosts
          }
        />
      }
      sidebar={
        isHunter && user.hunter ? (
          <HunterSidebar
            hunter={{
              id: user.hunter.id,
              name: user.name,
              gender: user.hunter.gender,
              age: user.hunter.age,
              class: user.hunter.class,
              rank: hunterData.rank,
              rankScore: hunterData.rankScore,
              avatarUrl: user.avatarUrl,
              autoMatch: hunterData.autoMatch,
            }}
            matchmakingRequests={matchmakingRequests}
            requests={requests}
            summary={summary}
            hasActiveTask={hasActiveTask}
            onAutoMatchChange={handleAutoMatchChange}
            onAcceptMatchmaking={handleAcceptMatchmaking}
            onDenyMatchmaking={handleDenyMatchmaking}
            onFinishTask={handleFinishTask}
          />
        ) : (
          <UserSidebar
            user={{ id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl }}
            posts={posts}
            onCreatePost={() => navigate("/user/create-post")}
          />
        )
      }
    />
  )
}
