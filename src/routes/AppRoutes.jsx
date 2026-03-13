import { Routes, Route, Navigate } from 'react-router-dom'
import { LandingLayout } from '../layouts/LandingLayout'
import { LoginLayout } from '../layouts/LoginLayout'
import { UserLayout } from '../layouts/UserLayout'
import { AdminLayout } from '../layouts/AdminLayout'
import { LandingPage } from '../pages/LandingPage'
import { AuthPage } from '../pages/LoginPages/Auth'
import { RegisterPage } from '../pages/LoginPages/Register'
import { OnboardingPage } from '../pages/LoginPages/OnBoarding'
import { UserDashboard } from '../features/UserDashboard'
import { Diary } from '../features/Diary'
import { FoodSearch } from '../features/FoodSearch'
import { Statistics } from '../features/Stats'
import { Profile } from '../features/Profile'
import { AdminDashboard } from '../pages/AdminDashboard'

import { useAuthStore } from '../store/authStore'

function ProtectedRoute({ children }) {
  const { user, loading, onboardingComplete } = useAuthStore()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to='/login' replace />
  }

  if (!onboardingComplete) {
    return <Navigate to='/onboarding' replace />
  }

  return children
}

function AdminRoute({ children }) {
  const { user, role, loading } = useAuthStore()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user || role !== 'admin') {
    return <Navigate to='/' replace />
  }

  return children
}

export default function AppRoutes() {
  const { user, loading, onboardingComplete } = useAuthStore()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Routes>
      <Route path='/' element={<LandingLayout />}>
        <Route index element={<LandingPage />} />
        <Route
          path='login'
          element={
            user ? (
              <Navigate to={onboardingComplete ? '/user/dashboard' : '/onboarding'} replace />
            ) : (
              <AuthPage />
            )
          }
        />
        <Route
          path='register'
          element={
            user ? (
              <Navigate to={onboardingComplete ? '/user/dashboard' : '/onboarding'} replace />
            ) : (
              <RegisterPage />
            )
          }
        />
      </Route>

      <Route path='/onboarding' element={<LoginLayout />}>
        <Route
          index
          element={
            user ? (
              onboardingComplete ? <Navigate to='/user/dashboard' replace /> : <OnboardingPage />
            ) : (
              <Navigate to='/login' replace />
            )
          }
        />
      </Route>

      <Route path='/user' element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to='dashboard' replace />} />
        <Route path='dashboard' element={<UserDashboard />} />
        <Route path='diary' element={<Diary />} />
        <Route path='food-search' element={<FoodSearch />} />
        <Route path='statistics' element={<Statistics />} />
        <Route path='settings' element={<Profile />} />
      </Route>

      <Route path='/admin' element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
      </Route>

      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}
