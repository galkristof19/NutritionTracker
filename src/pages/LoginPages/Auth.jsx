import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { useAuthStore } from '../../store/authStore'

export function AuthPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const setRole = useAuthStore((state) => state.setRole)
  const setLoading = useAuthStore((state) => state.setLoading)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user)
      setRole('user') // TODO: read role from Firestore / custom claims
      setLoading(false)
      navigate('/user/dashboard', { replace: true })
    } catch (err) {
      console.error('Login error', err)
      setError(err.message || 'Bejelentkezés sikertelen')
      setLoading(false)
    }
  }

  return (
    <div className='auth-page'>
      <h3>Login</h3>
      <form onSubmit={handleSubmit} className='auth-form'>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className='error'>{error}</p>}
        <button type='submit'>Sign in</button>
      </form>
      <p>
        Nem vagy regisztrálva? Kérlek add hozzá a Firebase Console-ban egy usert a teszteléshez.
      </p>
    </div>
  )
}
