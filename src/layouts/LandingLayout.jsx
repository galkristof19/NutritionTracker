import { Outlet, Link } from 'react-router-dom'

export function LandingLayout() {
  return (
    <div className='layout landing-layout'>
      <header>
        <h2>Landing Layout</h2>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
