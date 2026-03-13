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

  const getOnboardingKey = (uid) => `onboarding_complete_${uid}`

  const isFirstSignIn = (user) => {
    const creationTime = user?.metadata?.creationTime
    const lastSignInTime = user?.metadata?.lastSignInTime
    return Boolean(creationTime && lastSignInTime && creationTime === lastSignInTime)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        // TODO: derive role from custom claims or DB
        setRole('user')

        const completedInBrowser = localStorage.getItem(getOnboardingKey(user.uid)) === '1'
        const onboardingComplete = completedInBrowser || !isFirstSignIn(user)
        setOnboardingComplete(onboardingComplete)
      } else {
        setUser(null)
        setRole('user')
        setOnboardingComplete(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [setUser, setRole, setLoading, setOnboardingComplete])

  return <AppRoutes />
}

export default App
