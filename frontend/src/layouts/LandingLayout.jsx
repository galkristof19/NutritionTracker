import { Outlet, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import './LandingLayout.scss'

export function LandingLayout() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className='landing-layout'>
      <a className='landing-layout__skip' href='#landing-content'>
        Ugras a tartalomra
      </a>

      <header className='landing-layout__header'>
        <Link to='/' className='landing-layout__brand'>
          LockedIn
        </Link>

        <nav className='landing-layout__actions' aria-label='Felhasznaloi muveletek'>
          {user ? (
            <Link to='/user/dashboard' className='landing-layout__cta'>
              My Profile
            </Link>
          ) : (
            <>
              <Link to='/login' className='landing-layout__link'>
                Belepes
              </Link>
              <Link to='/register' className='landing-layout__cta'>
                Regisztracio
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className='landing-layout__main' id='landing-content'>
        <Outlet />
      </main>

      <footer className='landing-layout__footer'>
        <p>LockedIn • Tudatos etkezes, merheto fejlodes.</p>
      </footer>
    </div>
  )
}
