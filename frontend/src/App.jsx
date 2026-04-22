import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebaseConfig'
import AppRoutes from './routes/AppRoutes'
import { useAuthStore } from './store/authStore'

function App() {
  const setUser = useAuthStore((state) => state.setUser)
  const setRole = useAuthStore((state) => state.setRole)
  const setLoading = useAuthStore((state) => state.setLoading)
  const setOnboardingComplete = useAuthStore((state) => state.setOnboardingComplete)
  const setIsInitialized = useAuthStore((state) => state.setIsInitialized)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  const getOnboardingKey = (uid) => `onboarding_complete_${uid}`

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        
        // Get role from Firebase Custom Claims (force refresh)
        try {
          const idTokenResult = await user.getIdTokenResult(true) // true = force refresh
          const role = idTokenResult.claims.role || 'user'
          console.log('User role:', role, 'Claims:', idTokenResult.claims)
          setRole(role)
        } catch (error) {
          console.error('Error getting user role:', error)
          setRole('user')
        }

        // Only consider onboarding complete if explicitly marked in localStorage
        const completedInBrowser = localStorage.getItem(getOnboardingKey(user.uid)) === '1'
        setOnboardingComplete(completedInBrowser)
      } else {
        setUser(null)
        setRole('user')
        setOnboardingComplete(false)
      }
      setLoading(false)
      setIsInitialized(true)
    })

    return () => unsubscribe()
  }, [setUser, setRole, setLoading, setOnboardingComplete, setIsInitialized])

  if (!isInitialized) {
    return <div>Loading...</div>
  }

  return <AppRoutes />
}

export default App
