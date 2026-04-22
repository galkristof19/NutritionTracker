import { create } from 'zustand'
import { signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from '../firebaseConfig'

export const useAuthStore = create((set) => ({
  loading: true,
  isInitialized: false,
  user: null,
  role: 'user',
  onboardingComplete: false,

  setLoading: (loading) => set({ loading }),
  setIsInitialized: (isInitialized) => set({ isInitialized }),
  setUser: (user) => set({ user, loading: false }),
  setRole: (role) => set({ role }),
  setOnboardingComplete: (onboardingComplete) => set({ onboardingComplete }),
  logout: async () => {
    try {
      await firebaseSignOut(auth)
      set({ user: null, role: 'user', onboardingComplete: false, loading: false })
    } catch (error) {
      console.error('Logout error', error)
    }
  },
}))
