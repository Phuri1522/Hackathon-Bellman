import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import SidebarLayout from "../components/SidebarLayout"
import UserSidebar from "../components/UserSidebar"
import HunterSidebar from "../components/HunterSidebar"
import HunterMap from "../components/HunterMap"

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

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isHunter = user?.accountType === "HUNTER"

  const [posts, setPosts] = useState<Post[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [summary, setSummary] = useState<Summary[]>([])
  const [hunterData, setHunterData] = useState({
    autoMatch: false,
    rank: user?.hunter?.rank ?? "D",
    rankScore: user?.hunter?.rankScore ?? 0,
  })

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
  }, [user])

  if (!user) return null

  return (
    <SidebarLayout
      map={<HunterMap role={isHunter ? "hunter" : "user"} />}
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
