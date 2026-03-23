import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { useAuthStore } from '../../store/authStore'
import './Auth.scss'

export function AuthPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const setRole = useAuthStore((state) => state.setRole)
  const setLoading = useAuthStore((state) => state.setLoading)
  const setOnboardingComplete = useAuthStore((state) => state.setOnboardingComplete)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const signedInUser = userCredential.user

      const onboardingKey = `onboarding_complete_${signedInUser.uid}`
      const completedInBrowser = localStorage.getItem(onboardingKey) === '1'
      const isFirstSignIn =
        signedInUser?.metadata?.creationTime &&
        signedInUser?.metadata?.lastSignInTime &&
        signedInUser.metadata.creationTime === signedInUser.metadata.lastSignInTime

      const shouldGoToOnboarding = !completedInBrowser && isFirstSignIn

      setUser(signedInUser)
      setRole('user') // TODO: read role from Firestore / custom claims
      setOnboardingComplete(!shouldGoToOnboarding)
      setLoading(false)
      navigate(shouldGoToOnboarding ? '/onboarding' : '/user/dashboard', { replace: true })
    } catch (err) {
      console.error('Login error', err)
      setError(err.message || 'Bejelentkezés sikertelen')
      setLoading(false)
    }
  }

  return (
    <div className='auth-page'>
      <h1 className='auth-page__title'>Belepes</h1>
      <p className='auth-page__subtitle'>
        Jelentkezz be a profilodba, es folytasd a napi kovetest.
      </p>

      <form onSubmit={handleSubmit} className='auth-form'>
        <div className='auth-form__field'>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className='auth-form__field'>
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
        <button type='submit' className='auth-form__submit'>Sign in</button>
      </form>

      <p className='auth-page__hint'>
        Nincs fiokod? <Link to='/register'>Regisztralj itt</Link>.
      </p>
    </div>
  )
}
