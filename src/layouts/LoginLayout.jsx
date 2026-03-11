import { Outlet } from 'react-router-dom'

export function LoginLayout() {
  return (
    <div className='layout login-layout'>
      <header>
        <h2>Login Layout</h2>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
