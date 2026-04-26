import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import './UserDashboard.scss'

const focusItems = [
  {
    title: 'Reggeli stabilitás',
    text: 'A hét eleji adatok alapján a korai, fehérjedús reggeli javította a napközbeni energiaszintet.',
    tag: 'Táplálkozási minta',
  },
  {
    title: 'Esti kalória terhelés',
    text: 'A vacsora utáni plusz snack mennyisége csökkent. Ezt a ritmust érdemes tartani a következő 7 napban is.',
    tag: 'Szokás finomhangolás',
  },
  {
    title: 'Hidratációs ritmus',
    text: 'A délelőtti folyadékfogyasztás még fejleszthető. Cél: délután 2 óráig legalább 1.2 liter.',
    tag: 'Napi célpont',
  },
]

const weeklyEnergy = [72, 84, 79, 88, 76, 91, 83]

export function UserDashboard() {
  const user = useAuthStore((state) => state.user)
  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Felhasználó'
  const dailyCalorieTarget = 2250
  const dailyCaloriesConsumed = 1620
  const dailyCaloriesRemaining = Math.max(dailyCalorieTarget - dailyCaloriesConsumed, 0)
  const dailyCalorieProgress = Math.min((dailyCaloriesConsumed / dailyCalorieTarget) * 100, 100)

  return (
    <section className='user-dashboard'>
      <header className='user-dashboard__hero'>
        <p className='user-dashboard__eyebrow'>Napi vezérlőpult</p>
        <h1 className='user-dashboard__title'>Szia, {firstName}! Itt a mai áttekintésed.</h1>
        <p className='user-dashboard__lead'>
          Ez az oldal egy gyors, vizuális összefoglaló a napi célokról, fő trendekről és a
          következő lépésekről. A fókusz most a konzisztens étkezési ritmuson és az energia
          egyensúlyon van.
        </p>
      </header>

      <section className='user-dashboard__daily-card'>
        <article className='user-dashboard__calorie-card'>
          <p className='user-dashboard__calorie-eyebrow'>Mai adatkártya</p>
          <h2 className='user-dashboard__calorie-title'>Kalória egyenleg</h2>
          <p className='user-dashboard__calorie-summary'>
            Ma <strong>{dailyCaloriesConsumed} kcal</strong> beviteled volt,
            <strong> {dailyCaloriesRemaining} kcal</strong> maradt a napi keretből.
          </p>
          <div className='user-dashboard__calorie-track' aria-hidden='true'>
            <div
              className='user-dashboard__calorie-fill'
              style={{ width: `${dailyCalorieProgress}%` }}
            />
          </div>
          <div className='user-dashboard__calorie-metrics'>
            <span>Cél: {dailyCalorieTarget} kcal</span>
            <span>Teljesülés: {Math.round(dailyCalorieProgress)}%</span>
          </div>
        </article>
      </section>

      <section className='user-dashboard__main-grid'>
        <article className='user-dashboard__panel'>
          <h2 className='user-dashboard__panel-title'>Gyors műveletek</h2>
          <p className='user-dashboard__panel-text'>
            Navigálj egy lépésből a leggyakrabban használt felületekre.
          </p>
          <div className='user-dashboard__actions'>
            <Link to='/user/diary' className='user-dashboard__action-btn'>Napló megnyitása</Link>
            <Link to='/user/food-search' className='user-dashboard__action-btn'>Étel keresése</Link>
            <Link to='/user/statistics' className='user-dashboard__action-btn'>Trendek áttekintése</Link>
            <Link to='/user/settings' className='user-dashboard__action-btn'>Profil szerkesztése</Link>
          </div>
        </article>

        <article className='user-dashboard__panel'>
          <h2 className='user-dashboard__panel-title'>Heti energia trend</h2>
          <p className='user-dashboard__panel-text'>
            A grafikon jelzi, mennyire volt kiegyensúlyozott a napi energiaszint a hét során.
          </p>
          <div className='user-dashboard__sparkline' aria-hidden='true'>
            {weeklyEnergy.map((value, index) => (
              <div key={`${value}-${index}`} className='user-dashboard__sparkline-item'>
                <div className='user-dashboard__sparkline-bar' style={{ height: `${value}%` }} />
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className='user-dashboard__focus-grid'>
        {focusItems.map((item) => (
          <article key={item.title} className='user-dashboard__focus-card'>
            <p className='user-dashboard__focus-tag'>{item.tag}</p>
            <h3 className='user-dashboard__focus-title'>{item.title}</h3>
            <p className='user-dashboard__focus-text'>{item.text}</p>
          </article>
        ))}
      </section>
    </section>
  )
}
