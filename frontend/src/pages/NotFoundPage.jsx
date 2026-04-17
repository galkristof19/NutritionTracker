import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import './NotFoundPage.scss'

export function NotFoundPage() {
  const user = useAuthStore((state) => state.user)
  const primaryTarget = user ? '/user/dashboard' : '/'
  const primaryLabel = user ? 'Back to dashboard' : 'Back to home'

  return (
    <main className='not-found-page' role='main' aria-labelledby='not-found-title'>
      <p className='not-found-page__code'>404</p>
      <h1 id='not-found-title' className='not-found-page__title'>
        This page was not found.
      </h1>
      <p className='not-found-page__text'>
        The link may be outdated, or there may be a typo in the URL.
      </p>

      <div className='not-found-page__actions'>
        <Link to={primaryTarget} className='not-found-page__button not-found-page__button--primary'>
          {primaryLabel}
        </Link>
        <Link to='/' className='not-found-page__button not-found-page__button--ghost'>
          Home
        </Link>
      </div>
    </main>
  )
}