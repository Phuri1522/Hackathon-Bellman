import { useEffect, useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import { getMutantHuntingRequestById } from "../modules/MutantHuntingRequestSystem/mutantHunting.api"
import SidebarLayout from "../components/SidebarLayout"
import UserSidebar from "../components/Usersidebar"
import HunterSidebar from "../components/Huntersidebar"
import HunterMap from "../components/HunterMap"

interface Post {
  id: number
  animalType: string
  mutantType: string
  classRequired: string
  distance?: string
  reward?: string
  status: string
  latitude?: number
  longitude?: number
}

interface Request {
  id: number
  animalType: string
  mutantType: string
  status: string
  postLatitude?: number
  postLongitude?: number
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

type HuntRequestForNotification = {
  id: number
  isAutoMatched: boolean
  post: {
    id: number
    animalType: string
    mutantType: string
    reward: string | null
    latitude: number
    longitude: number
  }
}

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isHunter = user?.accountType === "HUNTER"
  const mapRef = useRef<HunterMapHandle | null>(null)

  const [posts, setPosts] = useState<Post[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [summary, setSummary] = useState<Summary[]>([])
  const [hunterData, setHunterData] = useState({
    autoMatch: user?.hunter?.autoMatch ?? false,
    rank: user?.hunter?.rank ?? "D",
    rankScore: user?.hunter?.rankScore ?? 0,
  })
  const [pendingAutoMatch, setPendingAutoMatch] = useState<HuntRequestForNotification | null>(null)
  const shownIds = useRef<Set<number>>(new Set())

  const refreshHunterRequests = async (hunterId: number) => {
    const res = await api.get(`/api/hunt-requests?hunterId=${hunterId}`)
    const data = Array.isArray(res.data) ? res.data : []
    setRequests(data.map((r: any) => ({
      id: r.id,
      animalType: r.post?.animalType ?? "",
      mutantType: r.post?.mutantType ?? "",
      status: r.status,
      postLatitude: r.post?.latitude,
      postLongitude: r.post?.longitude,
    })))
  }

  const refreshHunterProfile = async (hunterId: number) => {
    const res = await api.get(`/api/hunters/${hunterId}`)
    setHunterData({
      autoMatch: res.data.autoMatch ?? false,
      rank: res.data.rank,
      rankScore: res.data.rankScore,
    })
  }

  const refreshHunterSummary = async (hunterId: number) => {
    const res = await api.get(`/api/hunters/${hunterId}/summary/weekly`)
    const data = res.data.requests ?? []
    setSummary(data.map((r: any) => ({
      id: r.id,
      animalType: r.animalType,
      mutantType: r.mutantType,
      classRequired: r.classRequired ?? "",
      reward: r.reward,
      powerScore: r.powerScore,
    })))
  }

  useEffect(() => {
    if (!user) return

    if (!isHunter) {
      // fetch user's posts
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
            latitude: p.latitude,
            longitude: p.longitude,
          })))
        })
        .catch(console.error)
    } else if (user.hunter) {
      const hunterId = user.hunter.id

      // fetch hunter profile (for autoMatch + rank)
      api.get(`/api/hunters/${hunterId}`)
        .then((res) => {
          setHunterData({
            autoMatch: res.data.autoMatch ?? false,
            rank: res.data.rank,
            rankScore: res.data.rankScore,
          })
        })
        .catch(console.error)

      // fetch hunt requests
      api.get(`/api/hunt-requests?hunterId=${hunterId}`)
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : []
          setRequests(data.map((r: any) => ({
            id: r.id,
            animalType: r.post?.animalType ?? "",
            mutantType: r.post?.mutantType ?? "",
            status: r.status,
            postLatitude: r.post?.latitude,
            postLongitude: r.post?.longitude,
          })))
        })
        .catch(console.error)

      // fetch weekly summary
      api.get(`/api/hunters/${hunterId}/summary/weekly`)
        .then((res) => {
          const data = res.data.requests ?? []
          setSummary(data.map((r: any) => ({
            id: r.id,
            animalType: r.animalType,
            mutantType: r.mutantType,
            classRequired: r.classRequired ?? "",
            reward: r.reward,
            powerScore: r.powerScore,
          })))
        })
        .catch(console.error)
    }
  }, [user, location.key])

  // poll user posts every 10s so status reflects hunter completions
  useEffect(() => {
    if (!user || isHunter) return
    const interval = setInterval(() => {
      api.get(`/api/mutant-hunting-requests`).then((res) => {
        const all = res.data.data ?? []
        const mine = all.filter((p: any) => p.userId === user.id)
        setPosts(mine.map((p: any) => ({
          id: p.id, animalType: p.animalType, mutantType: p.mutantType,
          classRequired: p.classRequired, reward: p.reward, status: p.status,
          latitude: p.latitude, longitude: p.longitude,
        })))
      }).catch(() => {})
    }, 10000)
    return () => clearInterval(interval)
  }, [user, isHunter])

  // refresh hunt requests when hunter applies manually
  useEffect(() => {
    if (!isHunter || !user?.hunter) return
    const hunterId = user.hunter.id
    const refresh = () => {
      api.get(`/api/hunt-requests?hunterId=${hunterId}`)
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : []
          setRequests(data.map((r: any) => ({
            id: r.id,
            animalType: r.post?.animalType ?? "",
            mutantType: r.post?.mutantType ?? "",
            status: r.status,
            postLatitude: r.post?.latitude,
            postLongitude: r.post?.longitude,
          })))
        })
        .catch(console.error)
    }
    window.addEventListener("hunt-request-applied", refresh)
    return () => window.removeEventListener("hunt-request-applied", refresh)
  }, [isHunter, user])

  // poll every 5s for auto-match notifications (HUNTER + autoMatch ON only)
  useEffect(() => {
    if (!isHunter || !user?.hunter || !hunterData.autoMatch) return

    const hunterId = user.hunter.id
    const poll = async () => {
      try {
        const res = await api.get(`/api/hunt-requests?hunterId=${hunterId}`)
        const data: any[] = Array.isArray(res.data) ? res.data : []
        // always update sidebar requests
        setRequests(data.map((r: any) => ({
          id: r.id,
          animalType: r.post?.animalType ?? "",
          mutantType: r.post?.mutantType ?? "",
          status: r.status,
          postLatitude: r.post?.latitude,
          postLongitude: r.post?.longitude,
        })))
        // check for new auto-match popup
        const match = data.find(
          (r) => r.status === "PENDING" && r.isAutoMatched && !shownIds.current.has(r.id)
        )
        if (match) {
          shownIds.current.add(match.id)
          setPendingAutoMatch(match)
        }
      } catch {
        // silent
      }
    }

    poll()
    const interval = setInterval(poll, 3000)
    return () => clearInterval(interval)
  }, [isHunter, user, hunterData.autoMatch])

  const handleAutoMatchAccept = async (req: HuntRequestForNotification) => {
    if (!user?.hunter) return
    try {
      await api.patch(`/api/hunt-requests/${req.id}`, { status: "ACCEPTED_BY_USER" })
      await Promise.all([
        refreshHunterRequests(user.hunter.id),
        refreshHunterProfile(user.hunter.id),
      ])
      mapRef.current?.flyTo(req.post.latitude, req.post.longitude, 15)
      getMutantHuntingRequestById(req.post.id)
        .then((post) => mapRef.current?.selectPost(post))
        .catch(() => {})
    } catch (err) {
      console.error("Accept failed", err)
    }
    setPendingAutoMatch(null)
  }

  const handleAutoMatchDecline = async (req: HuntRequestForNotification) => {
    if (!user?.hunter) return
    try {
      await api.patch(`/api/hunt-requests/${req.id}`, { status: "DECLINED_BY_HUNTER" })
      await refreshHunterRequests(user.hunter.id)
    } catch (err) {
      console.error("Decline failed", err)
    }
    setPendingAutoMatch(null)
  }

  const handleDismissRequest = async (id: number, status: string) => {
    if (status === "PENDING") {
      await api.patch(`/api/hunt-requests/${id}`, { status: "DECLINED_BY_HUNTER" }).catch(() => {})
    }
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  const handleCompleteRequest = async (requestId: number) => {
    if (!user?.hunter) return
    try {
      await api.patch(`/api/hunt-requests/${requestId}`, { status: "COMPLETED" })
      await Promise.all([
        refreshHunterRequests(user.hunter.id),
        refreshHunterProfile(user.hunter.id),
        refreshHunterSummary(user.hunter.id),
      ])
    } catch (err) {
      console.error("Complete failed", err)
    }
  }

  if (!user) return null

  return (
    <>
    {pendingAutoMatch && (
      <AutoMatchNotification
        huntRequest={pendingAutoMatch}
        onAccept={handleAutoMatchAccept}
        onDecline={handleAutoMatchDecline}
      />
    )}
    <SidebarLayout
      map={<HunterMap isHunter={isHunter} />}
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
            requests={requests}
            summary={summary}
            onSelectRequest={(lat, lng) => mapRef.current?.flyTo(lat, lng, 15)}
            onCompleteRequest={handleCompleteRequest}
          />
        ) : (
          <UserSidebar
            user={{ id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl }}
            posts={posts}
            onCreatePost={() => navigate("/user/create-post")}
            onSelectPost={(lat, lng) => mapRef.current?.flyTo(lat, lng, 15)}
          />
        )
      }
    />
    </>
  )
}
