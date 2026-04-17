import { useAuthStore } from '../store/authStore'

export function AdminDashboard() {
  const { user, role } = useAuthStore()

  return (
    <div>
      <h3>Admin Dashboard</h3>
      <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', marginTop: '20px' }}>
        <h4>Debug Info:</h4>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>UID:</strong> {user?.uid}</p>
        <p><strong>Role:</strong> <span style={{ color: role === 'admin' ? 'green' : 'red' }}>{role}</span></p>
      </div>
    </div>
  )
}
