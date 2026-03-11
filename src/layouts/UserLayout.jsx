import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function UserLayout() {
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className='layout user-layout'>
      <header>
        <h2>User Layout</h2>
        <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>
          Logout
        </button>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
