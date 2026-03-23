import { Outlet } from 'react-router-dom'
import { Navigation } from '../components/Navigation'

export function UserLayout() {
  return (
    <div className='user-layout'>
      <Navigation />
      <main className='user-layout__main'>
        <Outlet />
      </main>
    </div>
  )
}
