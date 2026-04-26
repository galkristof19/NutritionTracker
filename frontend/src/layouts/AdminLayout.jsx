import { Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import './AdminLayout.scss'

export function AdminLayout() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className='admin-shell'>
      <header className='admin-shell__header'>
        <div>
          <p className='admin-shell__eyebrow'>Admin Center</p>
          <h1 className='admin-shell__title'>Rendszerkezelő felület</h1>
        </div>
        <div className='admin-shell__meta'>
          <span className='admin-shell__badge'>role: admin</span>
          <span className='admin-shell__email'>{user?.email || 'ismeretlen'}</span>
        </div>
      </header>
      <main className='admin-shell__content'>
        <Outlet />
      </main>
    </div>
  )
}
