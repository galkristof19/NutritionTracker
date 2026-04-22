import { Outlet } from 'react-router-dom'
import { Navigation } from '../components/Navigation'
import './UserLayout.scss'

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
