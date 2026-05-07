import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import './LoginLayout.scss'

export function LoginLayout() {
  const location = useLocation()
  const onboardingComplete = useAuthStore((state) => state.onboardingComplete)
  const isOnboarding = location.pathname === '/onboarding'
  const canNavigateHome = !isOnboarding || onboardingComplete

  return (
    <div className='layout login-layout'>
      <header className='login-layout__header'>
        {canNavigateHome ? (
          <Link to='/' className='login-layout__brand'>
            LockIn
          </Link>
        ) : (
          <div className='login-layout__brand login-layout__brand--disabled'>
            LockIn
          </div>
        )}
      </header>

      <main className='login-layout__main'>
        <div className='login-layout__inner'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
