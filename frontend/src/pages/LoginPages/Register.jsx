import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { useAuthStore } from '../../store/authStore'
import { registerUser } from '../../api/authService'
import './Auth.scss'

export function RegisterPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const setRole = useAuthStore((state) => state.setRole)
  const setLoading = useAuthStore((state) => state.setLoading)
  const setOnboardingComplete = useAuthStore((state) => state.setOnboardingComplete)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('A nev megadasa kovetkezteteskeppen szukseges.')
      return
    }

    if (password !== confirmPassword) {
      setError('A ket jelszo nem egyezik meg.')
      return
    }

    setLoading(true)

    try {
      // Step 1: Register user via API (which handles both Firebase and DB)
      const response = await registerUser({
        email,
        password,
        name,
      })

      // Step 2: Sign in with the created credentials
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const createdUser = userCredential.user

      localStorage.removeItem(`onboarding_complete_${createdUser.uid}`)

      setUser(createdUser)
      setRole('user')
      setOnboardingComplete(false)
      setLoading(false)

      navigate('/onboarding', { replace: true })
    } catch (err) {
      console.error('Registration error', err)
      setError(err.message || 'Regisztracio sikertelen')
      setLoading(false)
    }
  }

  return (
    <div className='auth-page'>
      <h1 className='auth-page__title'>Regisztracio</h1>
      <p className='auth-page__subtitle'>
        Hozz letre egy fiokot, hogy elkezdhesd a napi kovetest.
      </p>

      <form onSubmit={handleSubmit} className='auth-form'>
        <div className='auth-form__field'>
          <label htmlFor='register-name'>Nev</label>
          <input
            id='register-name'
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className='auth-form__field'>
          <label htmlFor='register-email'>Email</label>
          <input
            id='register-email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className='auth-form__field'>
          <label htmlFor='register-password'>Password</label>
          <input
            id='register-password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className='auth-form__field'>
          <label htmlFor='register-password-confirm'>Password ujra</label>
          <input
            id='register-password-confirm'
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {error && <p className='error'>{error}</p>}
        <button type='submit' className='auth-form__submit'>Regisztracio</button>
      </form>

      <p className='auth-page__hint'>
        Van mar fiokod? <Link to='/login'>Lepj be itt</Link>.
      </p>
    </div>
  )
}
