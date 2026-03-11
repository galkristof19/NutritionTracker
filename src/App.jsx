import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebaseConfig'
import AppRoutes from './routes/AppRoutes'
import { useAuthStore } from './store/authStore'

function App() {
  const setUser = useAuthStore((state) => state.setUser)
  const setRole = useAuthStore((state) => state.setRole)
  const setLoading = useAuthStore((state) => state.setLoading)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        // TODO: derive role from custom claims or DB
        setRole('user')
      } else {
        setUser(null)
        setRole('user')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [setUser, setRole, setLoading])

  return <AppRoutes />
}

export default App
