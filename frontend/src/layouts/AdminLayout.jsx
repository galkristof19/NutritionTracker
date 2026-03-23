import { Outlet } from 'react-router-dom'

export function AdminLayout() {
  return (
    <div className='layout admin-layout'>
      <header>
        <h2>Admin Layout</h2>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
