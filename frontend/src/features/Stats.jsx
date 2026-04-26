import './Stats.scss'

const summaryCards = [
  {
    label: 'Átlag napi kalória',
    value: '2 145 kcal',
    delta: '+4.2%',
    trend: 'up',
    note: 'Az előző hét átlagához viszonyítva.',
  },
  {
    label: 'Fehérje cél teljesülése',
    value: '87%',
    delta: '+9.8%',
    trend: 'up',
    note: '5 nap teljesült a 7-ből.',
  },
  {
    label: 'Heti aktivitási index',
    value: '7.4 / 10',
    delta: '-1.1%',
    trend: 'down',
    note: 'Kisebb visszaesés a hétvégén.',
  },
  {
    label: 'Folyadékbevitel átlag',
    value: '2.6 l',
    delta: '+12.0%',
    trend: 'up',
    note: 'Stabilan a javasolt tartományban.',
  },
]

const weeklyTrend = [
  { day: 'H', calories: 1960, target: 2100 },
  { day: 'K', calories: 2280, target: 2100 },
  { day: 'Sze', calories: 2140, target: 2100 },
  { day: 'Cs', calories: 2050, target: 2100 },
  { day: 'P', calories: 2360, target: 2100 },
  { day: 'Szo', calories: 2480, target: 2100 },
  { day: 'V', calories: 2120, target: 2100 },
]

const macroSplit = [
  { label: 'Fehérje', percent: 32, amount: '168 g', tone: 'protein' },
  { label: 'Szénhidrát', percent: 44, amount: '244 g', tone: 'carb' },
  { label: 'Zsír', percent: 24, amount: '59 g', tone: 'fat' },
]

const habits = [
  {
    title: 'Reggeli konzisztencia',
    value: '6 / 7 nap',
    description:
      'A hét legtöbb napján reggel 8:30 előtt történt az első étkezés, ami segített stabilabban tartani az energiaszintet délelőtt.',
  },
  {
    title: 'Késő esti nassolás',
    value: '2 esemény',
    description:
      'A korábbi periódushoz képest csökkent az esti plusz kalória, különösen magas fehérje tartalmú vacsorák után.',
  },
  {
    title: 'Fehérje eloszlás',
    value: 'egyenletes',
    description:
      'A napi bevitel több étkezésben oszlik el, így jobb telítettségérzetet és kisebb vércukor-ingadozást támogat.',
  },
]

const monthlyHighlights = [
  'A napi kalóriaingadozás csökkent, ami hosszabb távon fenntarthatóbb ritmust jelez.',
  'Az aktivitás magasabb napjain jobb volt a folyadékfogyasztás és a fehérjecél teljesítése.',
  'A hétvégi energia-bevitel még mindig magasabb, de már kisebb kilengést mutat mint korábban.',
]

export function Statistics() {
  const maxCalories = Math.max(...weeklyTrend.map((item) => item.calories))

  return (
    <section className='stats-page'>
      <header className='stats-hero'>
        <p className='stats-hero__eyebrow'>Táplálkozási Elemzés</p>
        <h1 className='stats-hero__title'>Heti és havi teljesítmény áttekintés</h1>
        <p className='stats-hero__lead'>
          Ez a dashboard egy minta statisztikai nézet, amely vizuálisan mutatja a fő trendeket,
          célokhoz mért eltéréseket és néhány értelmező megállapítást. A jelenlegi adatok demó
          jellegűek, de a felépítés készen áll valós adatok fogadására is.
        </p>
      </header>

      <div className='stats-grid stats-grid--cards'>
        {summaryCards.map((card) => (
          <article key={card.label} className='stats-card'>
            <h2 className='stats-card__label'>{card.label}</h2>
            <p className='stats-card__value'>{card.value}</p>
            <p className={`stats-card__delta stats-card__delta--${card.trend}`}>{card.delta}</p>
            <p className='stats-card__note'>{card.note}</p>
          </article>
        ))}
      </div>

      <div className='stats-grid stats-grid--content'>
        <article className='stats-panel'>
          <h2 className='stats-panel__title'>Heti kalória trend</h2>
          <p className='stats-panel__text'>
            Az oszlopok a napi kalóriabevitelt mutatják, a célértékkel összevetve. A célhoz közeli
            napok kiegyensúlyozottabb energiaellátást jeleznek.
          </p>
          <div className='trend-chart'>
            {weeklyTrend.map((entry) => {
              const heightPercent = (entry.calories / maxCalories) * 100
              const targetPercent = (entry.target / maxCalories) * 100
              return (
                <div key={entry.day} className='trend-chart__item'>
                  <div className='trend-chart__bars'>
                    <div
                      className='trend-chart__target'
                      style={{ height: `${targetPercent}%` }}
                      aria-hidden='true'
                    />
                    <div
                      className='trend-chart__value'
                      style={{ height: `${heightPercent}%` }}
                      aria-label={`${entry.day}: ${entry.calories} kcal`}
                    />
                  </div>
                  <span className='trend-chart__day'>{entry.day}</span>
                </div>
              )
            })}
          </div>
        </article>

        <article className='stats-panel'>
          <h2 className='stats-panel__title'>Makrotápanyag megoszlás</h2>
          <p className='stats-panel__text'>
            A napi átlag alapján számolt arányok. A cél, hogy a fehérje stabil maradjon, miközben a
            szénhidrát és zsír bevitel az aktivitási szinthez igazodik.
          </p>
          <ul className='macro-list'>
            {macroSplit.map((macro) => (
              <li key={macro.label} className='macro-list__item'>
                <div className='macro-list__head'>
                  <span>{macro.label}</span>
                  <span>{macro.amount}</span>
                </div>
                <div className='macro-list__track'>
                  <div
                    className={`macro-list__fill macro-list__fill--${macro.tone}`}
                    style={{ width: `${macro.percent}%` }}
                  />
                </div>
                <span className='macro-list__percent'>{macro.percent}%</span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className='stats-grid stats-grid--insights'>
        <article className='stats-panel'>
          <h2 className='stats-panel__title'>Viselkedési minták</h2>
          <div className='insight-list'>
            {habits.map((habit) => (
              <div key={habit.title} className='insight-item'>
                <h3 className='insight-item__title'>{habit.title}</h3>
                <p className='insight-item__value'>{habit.value}</p>
                <p className='insight-item__text'>{habit.description}</p>
              </div>
            ))}
          </div>
        </article>

        <article className='stats-panel stats-panel--accent'>
          <h2 className='stats-panel__title'>Havi összefoglaló</h2>
          <p className='stats-panel__text'>
            A fő trendek alapján a fejlődés iránya kedvező. Az egyenletesebb kalóriabevitel és a
            javuló folyadékfogyasztás együtt támogatják a hosszú távon fenntartható rutint.
          </p>
          <ul className='highlight-list'>
            {monthlyHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}
