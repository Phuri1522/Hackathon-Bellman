import api from "./api"

export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post("/api/auth/login", { email, password })
    return res.data
  },
  registerUser: async (data: { name: string; email: string; password: string }) => {
    const res = await api.post("/api/auth/register", { ...data, accountType: "USER" })
    return res.data
  },
  registerHunter: async (data: { name: string; email: string; password: string; gender: string; age: number; class: string }) => {
    const res = await api.post("/api/auth/register", { ...data, accountType: "HUNTER" })
    return res.data
  },
  checkEmail: async (email: string): Promise<boolean> => {
    const res = await api.get(`/api/auth/check-email?email=${email}`)
    return res.data.available
  },
}