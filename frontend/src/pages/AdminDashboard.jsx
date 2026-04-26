import { useAuthStore } from '../store/authStore'
import './AdminDashboard.scss'

const adminKpis = [
  { label: 'Aktív felhasználók', value: '1 284', tone: 'info' },
  { label: 'Mai új regisztráció', value: '42', tone: 'success' },
  { label: 'Nyitott riportok', value: '7', tone: 'warning' },
  { label: 'Rendszer állapot', value: 'Stabil', tone: 'success' },
]

const tasks = [
  { title: 'Jóváhagyásra váró receptek átnézése', priority: 'Magas', owner: 'Content Team' },
  { title: 'Felhasználói riportok validálása', priority: 'Közepes', owner: 'Support' },
  { title: 'Heti admin összefoglaló export', priority: 'Alacsony', owner: 'Ops' },
]

const activityFeed = [
  '09:12 - 16 új recept feltöltés érkezett',
  '10:03 - 3 felhasználói riport lezárva',
  '11:41 - Admin jogosultság módosítás történt',
  '12:28 - Sikeres napi adatmentés',
]

export function AdminDashboard() {
  const { user, role } = useAuthStore()

  return (
    <section className='admin-dashboard'>
      <header className='admin-dashboard__hero'>
        <h2 className='admin-dashboard__title'>Admin Dashboard</h2>
        <p className='admin-dashboard__lead'>
          Rövid, célzott áttekintés a napi admin feladatokról. Fókusz: gyors döntések,
          riportkezelés, stabil működés.
        </p>
      </header>

      <section className='admin-dashboard__kpis'>
        {adminKpis.map((item) => (
          <article key={item.label} className='admin-dashboard__kpi-card'>
            <p className='admin-dashboard__kpi-label'>{item.label}</p>
            <p className={`admin-dashboard__kpi-value is-${item.tone}`}>{item.value}</p>
          </article>
        ))}
      </section>

      <section className='admin-dashboard__grid'>
        <article className='admin-dashboard__panel'>
          <h3 className='admin-dashboard__panel-title'>Mai teendők</h3>
          <ul className='admin-dashboard__task-list'>
            {tasks.map((task) => (
              <li key={task.title} className='admin-dashboard__task-item'>
                <p className='admin-dashboard__task-title'>{task.title}</p>
                <p className='admin-dashboard__task-meta'>Prioritás: {task.priority} • Felelős: {task.owner}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className='admin-dashboard__panel'>
          <h3 className='admin-dashboard__panel-title'>Aktivitás feed</h3>
          <ul className='admin-dashboard__activity-list'>
            {activityFeed.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </article>
      </section>
    </section>
  )
}
