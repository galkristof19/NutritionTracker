import { useState, useEffect } from 'react'
import { getCurrentUser, updateUserProfile } from '../api/authService'
import './Profile.scss'

export function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthDate: '',
    height: '',
    currentWeight: '',
    activityLevel: 1,
    dailyCalorieGoal: '',
    weightGoal: '',
  })

  const formatBirthDate = (birthDate) => {
    if (!birthDate) return 'Nincs megadva'

    const parsedDate = new Date(birthDate)
    if (Number.isNaN(parsedDate.getTime())) {
      return birthDate
    }

    return new Intl.DateTimeFormat('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(parsedDate)
  }

  const getGenderLabel = (gender) => {
    if (gender === 'male') return 'Férfi'
    if (gender === 'female') return 'Nő'
    if (gender === 'other') return 'Egyéb'
    return 'Nincs megadva'
  }

  const getActivityLabel = (activityLevel) => {
    const level = Number(activityLevel)
    if (!level) return 'Nincs megadva'
    if (level < 1.4) return 'Ülő életmód'
    if (level < 1.7) return 'Mérsékelten aktív'
    if (level < 2) return 'Aktív'
    return 'Nagyon aktív'
  }

  const getBmi = () => {
    if (!user?.height || !user?.currentWeight) return null
    const heightInMeters = Number(user.height) / 100
    if (!heightInMeters) return null
    return (Number(user.currentWeight) / (heightInMeters * heightInMeters)).toFixed(1)
  }

  const getGoalDifference = () => {
    if (!user?.currentWeight || !user?.weightGoal) return null
    return (Number(user.weightGoal) - Number(user.currentWeight)).toFixed(1)
  }

  const getProfileCompleteness = () => {
    const fields = [
      user?.name,
      user?.gender,
      user?.birthDate,
      user?.height,
      user?.currentWeight,
      user?.weightGoal,
      user?.dailyCalorieGoal,
      user?.activityLevel,
    ]
    const completed = fields.filter(Boolean).length
    return Math.round((completed / fields.length) * 100)
  }

  // Load user data on mount
  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getCurrentUser()

      console.log('API válasz:', data)

      if (data.success) {
        console.log('Felhasználó adatok:', data.user)
        setUser(data.user)
        setFormData({
          name: data.user.name || '',
          gender: data.user.gender || '',
          birthDate: data.user.birthDate || '',
          height: data.user.height || '',
          currentWeight: data.user.currentWeight || '',
          activityLevel: data.user.activityLevel || 1,
          dailyCalorieGoal: data.user.dailyCalorieGoal || '',
          weightGoal: data.user.weightGoal || '',
        })
      } else {
        setError(data.message || 'Hiba a profil betöltésekor')
      }
    } catch (err) {
      console.error('Load profile error:', err)
      setError('Hiba a profil betöltésekor')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'activityLevel' ? parseInt(value) : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      setSuccessMessage(null)

      const updateData = {
        name: formData.name || undefined,
        gender: formData.gender || undefined,
        birthDate: formData.birthDate || undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        currentWeight: formData.currentWeight ? parseFloat(formData.currentWeight) : undefined,
        activityLevel: formData.activityLevel,
        dailyCalorieGoal: formData.dailyCalorieGoal ? parseFloat(formData.dailyCalorieGoal) : undefined,
        weightGoal: formData.weightGoal ? parseFloat(formData.weightGoal) : undefined,
      }

      const result = await updateUserProfile(updateData)

      if (result.success) {
        setUser(result.user)
        setSuccessMessage('Profil sikeresen frissítve!')
        setIsEditing(false)
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setError(result.message || 'Hiba a profil frissítésekor')
      }
    } catch (err) {
      console.error('Update profile error:', err)
      setError('Hiba a profil frissítésekor')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      name: user.name || '',
      gender: user.gender || '',
      birthDate: user.birthDate || '',
      height: user.height || '',
      currentWeight: user.currentWeight || '',
      activityLevel: user.activityLevel || 1,
      dailyCalorieGoal: user.dailyCalorieGoal || '',
      weightGoal: user.weightGoal || '',
    })
  }

  if (loading) {
    return <div className="profile-loading">Profil betöltése...</div>
  }

  if (!user) {
    return <div className="profile-error">Hiba a profil betöltésekor</div>
  }

  const bmi = getBmi()
  const goalDifference = getGoalDifference()
  const profileCompleteness = getProfileCompleteness()

  return (
    <section className="profile-page">
      <header className="profile-hero">
        <p className="profile-hero__eyebrow">Személyes Dashboard</p>
        <h1 className="profile-hero__title">Profil és egészségügyi alapadatok</h1>
        <p className="profile-hero__lead">
          Itt találod a jelenlegi adataid összefoglalóját és azokat a kulcsértékeket,
          amelyek támogatják a napi étkezési és aktivitási döntéseidet.
        </p>
      </header>

      {error && <div className="profile-error-message">{error}</div>}
      {successMessage && <div className="profile-success-message">{successMessage}</div>}

      <div className="profile-top-grid">
        <article className="profile-user-card">
          <p className="profile-user-card__label">Fiók tulajdonos</p>
          <h2 className="profile-user-card__name">{user.name || 'Névtelen felhasználó'}</h2>
          <p className="profile-user-card__email">{user.email}</p>
          <span className="profile-user-card__role">Szerepkör: {user.role || 'user'}</span>
        </article>

        <article className="profile-completeness-card">
          <p className="profile-completeness-card__label">Profil teljessége</p>
          <p className="profile-completeness-card__value">{profileCompleteness}%</p>
          <div className="profile-completeness-card__track" aria-hidden="true">
            <div
              className="profile-completeness-card__fill"
              style={{ width: `${profileCompleteness}%` }}
            />
          </div>
          <p className="profile-completeness-card__text">
            Minél több mező van kitöltve, annál pontosabb ajánlásokat tud adni az alkalmazás.
          </p>
        </article>
      </div>

      <div className="profile-kpi-grid">
        <article className="profile-kpi-card">
          <p className="profile-kpi-card__label">Jelenlegi súly</p>
          <p className="profile-kpi-card__value">{user.currentWeight || '—'} kg</p>
        </article>
        <article className="profile-kpi-card">
          <p className="profile-kpi-card__label">Cél súly</p>
          <p className="profile-kpi-card__value">{user.weightGoal || '—'} kg</p>
        </article>
        <article className="profile-kpi-card">
          <p className="profile-kpi-card__label">Becsült BMI</p>
          <p className="profile-kpi-card__value">{bmi || '—'}</p>
        </article>
        <article className="profile-kpi-card">
          <p className="profile-kpi-card__label">Súly különbség a célhoz</p>
          <p className="profile-kpi-card__value">{goalDifference ? `${goalDifference} kg` : '—'}</p>
        </article>
      </div>

      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-header__title">Részletes adatok</h2>
          <p className="profile-header__subtitle">
            Az alábbi adatok szolgálnak a személyre szabott kalória- és aktivitási célok alapjául.
          </p>
        </div>

        {!isEditing ? (
          <div className="profile-view">
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <span className="profile-info-label">Nem</span>
                <span className="profile-info-value">{getGenderLabel(user.gender)}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Születési dátum</span>
                <span className="profile-info-value">{formatBirthDate(user.birthDate)}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Magasság (cm)</span>
                <span className="profile-info-value">{user.height || 'Nincs megadva'}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Jelenlegi súly (kg)</span>
                <span className="profile-info-value">{user.currentWeight || 'Nincs megadva'}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Cél súly (kg)</span>
                <span className="profile-info-value">{user.weightGoal || 'Nincs megadva'}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Aktivitási szint</span>
                <span className="profile-info-value">
                  {user.activityLevel || 'Nincs megadva'}
                  {user.activityLevel ? ` (${getActivityLabel(user.activityLevel)})` : ''}
                </span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Napi kalória cél</span>
                <span className="profile-info-value">{user.dailyCalorieGoal || 'Nincs megadva'} kcal</span>
              </div>
            </div>

            <div className="profile-view__footer">
              <p className="profile-view__text">
                Tipp: a rendszeres profilfrissítés segít pontosabban követni a változásokat és a
                célokhoz vezető ütemet.
              </p>
              <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>
                Profil szerkesztése
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="profile-form-group">
              <label htmlFor="name" className="profile-form-label">Név *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="profile-form-input"
                required
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="gender" className="profile-form-label">Nem</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="profile-form-input"
              >
                <option value="">Válassz...</option>
                <option value="male">Férfi</option>
                <option value="female">Nő</option>
              </select>
            </div>

            <div className="profile-form-group">
              <label htmlFor="birthDate" className="profile-form-label">Születési dátum</label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="profile-form-input"
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="height" className="profile-form-label">Magasság (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="profile-form-input"
                min="1"
                step="0.1"
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="currentWeight" className="profile-form-label">Jelenlegi súly (kg)</label>
              <input
                type="number"
                id="currentWeight"
                name="currentWeight"
                value={formData.currentWeight}
                onChange={handleInputChange}
                className="profile-form-input"
                min="1"
                step="0.1"
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="weightGoal" className="profile-form-label">Cél súly (kg)</label>
              <input
                type="number"
                id="weightGoal"
                name="weightGoal"
                value={formData.weightGoal}
                onChange={handleInputChange}
                className="profile-form-input"
                min="1"
                step="0.1"
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="activityLevel" className="profile-form-label">Aktivitási szint</label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleInputChange}
                className="profile-form-input"
              >
                <option value="1.2">Ülő (Kevés mozgás)</option>
                <option value="1.375">Kicsit aktív (1-3x edzés/hét)</option>
                <option value="1.55">Mérsékelt (3-5x edzés/hét)</option>
                <option value="1.725">Nagyon aktív (6-7x edzés/hét)</option>
                <option value="1.9">Extrémen aktív (Napi edzés)</option>
              </select>
            </div>

            <div className="profile-form-group">
              <label htmlFor="dailyCalorieGoal" className="profile-form-label">Napi kalória cél (kcal)</label>
              <input
                type="number"
                id="dailyCalorieGoal"
                name="dailyCalorieGoal"
                value={formData.dailyCalorieGoal}
                onChange={handleInputChange}
                className="profile-form-input"
                min="1"
                step="1"
              />
            </div>

            <div className="profile-form-actions">
              <button type="submit" className="profile-save-btn">Mentés</button>
              <button type="button" className="profile-cancel-btn" onClick={handleCancel}>
                Mégse
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
