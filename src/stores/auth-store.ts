import { create } from "zustand"
import type { Plan } from "@/types"

interface AuthState {
  plan: Plan
  setPlan: (plan: Plan) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  plan: "free",
  setPlan: (plan) => set({ plan }),
}))
