import { useMemo, useState } from 'react'
import './Diary.scss'

const mockDiaryEntries = {
  '2026-04-03': [
    { mealType: 'Reggeli', title: 'Zabkása bogyós gyümölccsel', calories: 410, protein: 18, carbs: 54, fat: 11 },
    { mealType: 'Ebéd', title: 'Csirkemell jázmin rizzsel', calories: 620, protein: 48, carbs: 62, fat: 17 },
    { mealType: 'Vacsora', title: 'Tonhalsaláta teljes kiőrlésű pitával', calories: 520, protein: 36, carbs: 40, fat: 22 },
  ],
  '2026-04-08': [
    { mealType: 'Reggeli', title: 'Tojásrántotta avokádóval', calories: 460, protein: 26, carbs: 14, fat: 31 },
    { mealType: 'Snack', title: 'Görög joghurt dióval', calories: 280, protein: 17, carbs: 12, fat: 15 },
    { mealType: 'Vacsora', title: 'Lazac édesburgonyával', calories: 670, protein: 44, carbs: 58, fat: 24 },
  ],
  '2026-04-12': [
    { mealType: 'Ebéd', title: 'Marha wok zöldségekkel', calories: 740, protein: 51, carbs: 49, fat: 33 },
    { mealType: 'Vacsora', title: 'Túrókrém teljes kiőrlésű kenyérrel', calories: 430, protein: 29, carbs: 37, fat: 16 },
  ],
  '2026-04-17': [
    { mealType: 'Reggeli', title: 'Protein palacsinta', calories: 390, protein: 31, carbs: 28, fat: 14 },
    { mealType: 'Ebéd', title: 'Pulykás quinoa tál', calories: 610, protein: 47, carbs: 52, fat: 19 },
    { mealType: 'Snack', title: 'Almás mogyoróvaj smoothie', calories: 320, protein: 12, carbs: 41, fat: 13 },
    { mealType: 'Vacsora', title: 'Mozzarellás zöldség omlett', calories: 470, protein: 34, carbs: 17, fat: 28 },
  ],
  '2026-04-23': [
    { mealType: 'Reggeli', title: 'Chia puding', calories: 340, protein: 15, carbs: 35, fat: 16 },
    { mealType: 'Ebéd', title: 'Lencsefőzelék főtt tojással', calories: 580, protein: 30, carbs: 72, fat: 18 },
  ],
  '2026-04-26': [
    { mealType: 'Reggeli', title: 'Banános zabturmix', calories: 370, protein: 22, carbs: 44, fat: 11 },
    { mealType: 'Ebéd', title: 'Sült csirke bulgurral', calories: 640, protein: 49, carbs: 59, fat: 18 },
    { mealType: 'Vacsora', title: 'Cézár saláta light öntettel', calories: 510, protein: 33, carbs: 27, fat: 26 },
  ],
}

const mockHydrationByDate = {
  '2026-04-03': 2.4,
  '2026-04-08': 2.1,
  '2026-04-12': 2.7,
  '2026-04-17': 2.9,
  '2026-04-23': 2.2,
  '2026-04-26': 2.6,
}

const weekdayLabels = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V']

const toDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function Diary() {
  const today = new Date()
  const [displayedMonth, setDisplayedMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(today)

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('hu-HU', {
        year: 'numeric',
        month: 'long',
      }).format(displayedMonth),
    [displayedMonth]
  )

  const selectedDateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }).format(selectedDate),
    [selectedDate]
  )

  const calendarDays = useMemo(() => {
    const year = displayedMonth.getFullYear()
    const month = displayedMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const offset = (firstDay.getDay() + 6) % 7

    const result = []

    for (let i = 0; i < offset; i++) {
      result.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      result.push(date)
    }

    while (result.length % 7 !== 0) {
      result.push(null)
    }

    return result
  }, [displayedMonth])

  const selectedDateKey = toDateKey(selectedDate)
  const selectedEntries = mockDiaryEntries[selectedDateKey] || []
  const selectedHydration = mockHydrationByDate[selectedDateKey] || 0

  const selectedTotals = selectedEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const monthEntries = useMemo(() => {
    const monthPrefix = `${displayedMonth.getFullYear()}-${String(displayedMonth.getMonth() + 1).padStart(2, '0')}-`
    return Object.entries(mockDiaryEntries)
      .filter(([key]) => key.startsWith(monthPrefix))
      .flatMap(([, entries]) => entries)
  }, [displayedMonth])

  const monthlyAverageCalories =
    monthEntries.length > 0
      ? Math.round(monthEntries.reduce((sum, entry) => sum + entry.calories, 0) / monthEntries.length)
      : 0

  const daysWithEntries = useMemo(() => {
    const monthPrefix = `${displayedMonth.getFullYear()}-${String(displayedMonth.getMonth() + 1).padStart(2, '0')}-`
    return Object.keys(mockDiaryEntries).filter((key) => key.startsWith(monthPrefix)).length
  }, [displayedMonth])

  const changeMonth = (direction) => {
    setDisplayedMonth(
      (previous) => new Date(previous.getFullYear(), previous.getMonth() + direction, 1)
    )
  }

  return (
    <section className="diary-page">
      <header className="diary-hero">
        <p className="diary-hero__eyebrow">Napi napló</p>
        <h1 className="diary-hero__title">Étkezési és hidratációs áttekintés</h1>
        <p className="diary-hero__lead">
          A napló célja, hogy egy helyen lásd a napi étkezéseket, makrókat és a folyadékbevitelt.
          A naptár segít gyorsan visszanézni a mintákat, a napi kártyák pedig azonnali képet adnak
          az energia- és tápanyageloszlásról.
        </p>
      </header>

      <div className="diary-summary-grid">
        <article className="diary-summary-card">
          <p className="diary-summary-card__label">Naplózott napok (hó)</p>
          <p className="diary-summary-card__value">{daysWithEntries}</p>
        </article>
        <article className="diary-summary-card">
          <p className="diary-summary-card__label">Átlag kalória / étkezés</p>
          <p className="diary-summary-card__value">{monthlyAverageCalories} kcal</p>
        </article>
        <article className="diary-summary-card">
          <p className="diary-summary-card__label">Kiválasztott napi étkezés</p>
          <p className="diary-summary-card__value">{selectedEntries.length} db</p>
        </article>
        <article className="diary-summary-card">
          <p className="diary-summary-card__label">Kiválasztott napi folyadék</p>
          <p className="diary-summary-card__value">{selectedHydration.toFixed(1)} l</p>
        </article>
      </div>

      <div className="diary-grid">
        <article className="diary-calendar-panel">
          <div className="diary-calendar-header">
            <button className="diary-month-button" onClick={() => changeMonth(-1)} type="button">
              ←
            </button>
            <h2 className="diary-month-title">{monthLabel}</h2>
            <button className="diary-month-button" onClick={() => changeMonth(1)} type="button">
              →
            </button>
          </div>

          <div className="diary-weekdays">
            {weekdayLabels.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="diary-calendar-grid">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="diary-calendar-cell diary-calendar-cell--empty" />
              }

              const key = toDateKey(date)
              const hasEntry = Boolean(mockDiaryEntries[key]?.length)
              const isSelected = key === selectedDateKey
              const isToday = key === toDateKey(today)

              return (
                <button
                  key={key}
                  type="button"
                  className={`diary-calendar-cell ${isSelected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <span>{date.getDate()}</span>
                  {hasEntry && <i className="diary-entry-dot" aria-hidden="true" />}
                </button>
              )
            })}
          </div>
        </article>

        <article className="diary-details-panel">
          <header className="diary-details-header">
            <h2 className="diary-details-title">{selectedDateLabel}</h2>
            <p className="diary-details-subtitle">Napi bontás és makró összesítés</p>
          </header>

          <div className="diary-totals-grid">
            <div className="diary-total-item">
              <span>Kalória</span>
              <strong>{selectedTotals.calories} kcal</strong>
            </div>
            <div className="diary-total-item">
              <span>Fehérje</span>
              <strong>{selectedTotals.protein} g</strong>
            </div>
            <div className="diary-total-item">
              <span>Szénhidrát</span>
              <strong>{selectedTotals.carbs} g</strong>
            </div>
            <div className="diary-total-item">
              <span>Zsír</span>
              <strong>{selectedTotals.fat} g</strong>
            </div>
            <div className="diary-total-item">
              <span>Folyadék</span>
              <strong>{selectedHydration.toFixed(1)} l</strong>
            </div>
          </div>

          {selectedEntries.length > 0 ? (
            <div className="diary-entry-list">
              {selectedEntries.map((entry, index) => (
                <article key={`${entry.title}-${index}`} className="diary-entry-card">
                  <div className="diary-entry-card__header">
                    <span className="diary-entry-card__meal">{entry.mealType}</span>
                    <span className="diary-entry-card__calories">{entry.calories} kcal</span>
                  </div>
                  <h3 className="diary-entry-card__title">{entry.title}</h3>
                  <p className="diary-entry-card__macros">
                    Fehérje: {entry.protein} g • Szénhidrát: {entry.carbs} g • Zsír: {entry.fat} g
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="diary-empty-day">
              <p>Erre a napra még nincs bejegyzés.</p>
              <p>Válassz másik dátumot a naptárban, vagy később tölts fel étkezést.</p>
            </div>
          )}
        </article>
      </div>
    </section>
  )
}
