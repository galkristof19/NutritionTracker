import { Link } from 'react-router-dom'
import './LandingPage.scss'

const GOALS = [
  'Fogyas es testsuly kontroll',
  'Tomegnoveles pontos kaloria tervezessel',
  'Makrotapanyag egyensuly javitasa',
  'Specialis etrend kovetese',
]

const FEATURES = [
  {
    title: 'Dashboard es naplo',
    text: 'Napi kaloriakeret, bevitel es fennmarado keret attekintheto egy helyen.',
  },
  {
    title: 'Gyors etelkereso',
    text: 'Rogzits etelt mennyiseggel, szerkesztheto bejegyzesekkel.',
  },
  {
    title: 'Statisztika modul',
    text: 'Heti trendek, sulyvaltozas es celhoz viszonyitott haladas.',
  },
  {
    title: 'Szemelyre szabhato profil',
    text: 'Aktivitasi szint, biometria, napi celok - mind testre szabva.',
  },
]

const OPINIONS = [
  {
    name: 'Dora, 29',
    quote: 'Vegre latom, hogy naponta mennyit eszek es hol csuszom el.',
  },
  {
    name: 'Bence, 34',
    quote: 'A dashboard alapjan sokkal egyszerubb a meal prep es a heti terv.',
  },
  {
    name: 'Lili, 25',
    quote: 'A statisztikak miatt konnyebb tartani a motivaciot.',
  },
]

export function LandingPage() {
  return (
    <div className='landing-page'>
      <section className='landing-page__hero' aria-labelledby='hero-title'>
        <div className='landing-page__hero-content'>
          <p className='landing-page__eyebrow'>Mindful nutrition app</p>
          <h1 className='landing-page__title' id='hero-title'>
            Merd a fejlodesed, ne csak talalgass.
          </h1>
          <p className='landing-page__subtitle'>
            A LockedIn segit atlatni etkezesi szokasaidat, hogy tisztan lasd a
            kaloriat, a makrokat es a napi celjaid teljesuleset.
          </p>
          <div className='landing-page__hero-actions'>
            <Link to='/login' className='landing-page__button landing-page__button--primary'>
              Kezdes most
            </Link>
            <a href='#features' className='landing-page__button landing-page__button--ghost'>
              Feature lista
            </a>
          </div>
        </div>

        <picture className='landing-page__hero-media'>
          <source
            media='(min-width: 1200px)'
            srcSet='/landing/hero-1280.svg 1280w, /landing/hero-640.svg 640w'
            sizes='(min-width: 1200px) 36rem, 100vw'
          />
          <source
            media='(min-width: 768px)'
            srcSet='/landing/hero-1280.svg 1280w, /landing/hero-640.svg 640w'
            sizes='(min-width: 768px) 50vw, 100vw'
          />
          <img
            src='/landing/hero-640.svg'
            alt='Kaloria dashboard illusztracio'
            loading='eager'
            decoding='async'
          />
        </picture>
      </section>

      <section className='landing-page__section' id='preview' aria-labelledby='preview-title'>
        <h2 id='preview-title'>Termek elo-nezet</h2>
        <div className='landing-page__media-grid'>
          <picture className='landing-page__media-card'>
            <source
              media='(min-width: 768px)'
              srcSet='/landing/preview-dashboard-1280.svg 1280w, /landing/preview-dashboard-640.svg 640w'
              sizes='(min-width: 1200px) 32rem, (min-width: 768px) 48vw, 100vw'
            />
            <img
              src='/landing/preview-dashboard-640.svg'
              alt='Napi kaloria osszegzo nezet'
              loading='lazy'
              decoding='async'
            />
          </picture>

          <picture className='landing-page__media-card'>
            <source
              media='(min-width: 768px)'
              srcSet='/landing/preview-diary-1280.svg 1280w, /landing/preview-diary-640.svg 640w'
              sizes='(min-width: 1200px) 32rem, (min-width: 768px) 48vw, 100vw'
            />
            <img
              src='/landing/preview-diary-640.svg'
              alt='Etkezesi naplo lista nezet'
              loading='lazy'
              decoding='async'
            />
          </picture>
        </div>
      </section>

      <section className='landing-page__section' id='motivation' aria-labelledby='motivation-title'>
        <h2 id='motivation-title'>Motivacio</h2>
        <p>
          Nem kell tokeletesnek lenned. Eleg, ha kovetkezetes vagy. A LockedIn
          segit napi szinten fenntartani a ritmust egyszeru es gyors rogzitessel.
        </p>
      </section>

      <section className='landing-page__section' id='goals' aria-labelledby='goals-title'>
        <h2 id='goals-title'>Reach Your Goals</h2>
        <ul className='landing-page__goals' role='list'>
          {GOALS.map((goal) => (
            <li key={goal} className='landing-page__goal-card'>
              {goal}
            </li>
          ))}
        </ul>
      </section>

      <section className='landing-page__section' id='features' aria-labelledby='features-title'>
        <h2 id='features-title'>Features List</h2>
        <div className='landing-page__features'>
          {FEATURES.map((feature) => (
            <article key={feature.title} className='landing-page__feature-card'>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className='landing-page__section' id='opinions' aria-labelledby='opinions-title'>
        <h2 id='opinions-title'>Opinions</h2>
        <div className='landing-page__opinions'>
          {OPINIONS.map((opinion) => (
            <figure key={opinion.name} className='landing-page__opinion-card'>
              <blockquote>{opinion.quote}</blockquote>
              <figcaption>{opinion.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  )
}
