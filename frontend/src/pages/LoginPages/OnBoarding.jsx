import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { updateUserProfile } from '../../api/authService'
import './OnBoarding.scss'

const QUESTIONS = [
  { key: 'gender', label: 'Nemed?', type: 'select', options: ['Férfi', 'Nő', 'Egyéb'], placeholder: 'Válassz...' },
  { key: 'birthDate', label: 'Születési dátum?', type: 'date', placeholder: 'YYYY-MM-DD' },
  { key: 'currentWeight', label: 'Jelenlegi súlyod (kg)?', type: 'number', placeholder: 'pl. 75' },
  { key: 'weightGoal', label: 'Célsúlyod (kg)?', type: 'number', placeholder: 'pl. 70' },
  { key: 'height', label: 'Magasságod (cm)?', type: 'number', placeholder: 'pl. 175' },
  { key: 'activityLevel', label: 'Aktivitási szint (0-10)?', type: 'range', min: 0, max: 10, placeholder: '5' },
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const setOnboardingComplete = useAuthStore((state) => state.setOnboardingComplete)
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState({
    gender: '',
    birthDate: '',
    currentWeight: '',
    weightGoal: '',
    height: '',
    activityLevel: '5',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === QUESTIONS.length - 1
  const currentQuestion = QUESTIONS[stepIndex]
  const currentAnswer = answers[currentQuestion.key]

  const handleAnswerChange = (event) => {
    const value = event.target.value
    setAnswers({
      ...answers,
      [currentQuestion.key]: value,
    })
    setError(null)
  }

  const convertActivityLevel = (sliderValue) => {
    // Convert 0-10 scale to 1.2-1.9 scale
    const val = parseInt(sliderValue)
    if (val <= 3) return 1.2
    if (val <= 6) return 1.55
    return 1.9
  }

  const convertGender = (gender) => {
    const genderMap = {
      'Férfi': 'male',
      'Nő': 'female',
      'Egyéb': 'other',
    }
    return genderMap[gender] || gender
  }

  const handleFinishOnboarding = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Prepare data for API
      const profileData = {
        gender: convertGender(answers.gender) || null,
        birthDate: answers.birthDate || null,
        currentWeight: answers.currentWeight ? parseInt(answers.currentWeight) : null,
        weightGoal: answers.weightGoal ? parseInt(answers.weightGoal) : null,
        height: answers.height ? parseInt(answers.height) : null,
        activityLevel: convertActivityLevel(answers.activityLevel),
      }

      // Update user profile via API
      await updateUserProfile(profileData)

      if (user?.uid) {
        localStorage.setItem(`onboarding_complete_${user.uid}`, '1')
        localStorage.setItem(`onboarding_answers_${user.uid}`, JSON.stringify(answers))
      }

      setOnboardingComplete(true)
      navigate('/user/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Hiba történt az adatok mentésekor')
      console.error('Onboarding error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (!currentAnswer?.toString().trim()) {
      setError('Kérjük töltsd ki a mezőt')
      return
    }

    if (isLastStep) {
      handleFinishOnboarding()
      return
    }

    setStepIndex((prev) => prev + 1)
  }

  const handleBack = () => {
    if (isFirstStep) {
      return
    }
    setStepIndex((prev) => prev - 1)
    setError(null)
  }

  return (
    <section className='onboarding-page' aria-labelledby='onboarding-title'>
      <h1 id='onboarding-title' className='onboarding-page__title'>
        Felhasználói profil
      </h1>
      <p className='onboarding-page__subtitle'>
        Add meg az adataidat, hogy személyre szabhassunk az ajánlásokat.
      </p>

      <p className='onboarding-page__progress'>
        Lépés {stepIndex + 1} / {QUESTIONS.length}
      </p>

      <div key={stepIndex} className='onboarding-card'>
        <h2 className='onboarding-card__question'>{currentQuestion.label}</h2>

        {currentQuestion.type === 'select' && (
          <select
            className='onboarding-card__input'
            value={currentAnswer}
            onChange={handleAnswerChange}
            autoFocus
          >
            <option value=''>{currentQuestion.placeholder}</option>
            {currentQuestion.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        {currentQuestion.type === 'date' && (
          <input
            className='onboarding-card__input'
            type='date'
            value={currentAnswer}
            onChange={handleAnswerChange}
            autoFocus
          />
        )}

        {currentQuestion.type === 'number' && (
          <input
            className='onboarding-card__input'
            type='number'
            value={currentAnswer}
            onChange={handleAnswerChange}
            placeholder={currentQuestion.placeholder}
            autoFocus
          />
        )}

        {currentQuestion.type === 'range' && (
          <div className='onboarding-card__range-container'>
            <input
              className='onboarding-card__range'
              type='range'
              min={currentQuestion.min}
              max={currentQuestion.max}
              value={currentAnswer}
              onChange={handleAnswerChange}
              autoFocus
            />
            <span className='onboarding-card__range-value'>{currentAnswer}</span>
          </div>
        )}

        {error && <p className='onboarding-card__error'>{error}</p>}
      </div>

      <div className='onboarding-page__actions'>
        <button
          type='button'
          className='onboarding-page__button onboarding-page__button--ghost'
          onClick={handleBack}
          disabled={isFirstStep || isLoading}
        >
          Előző
        </button>

        <button
          type='button'
          className='onboarding-page__button onboarding-page__button--primary'
          onClick={handleNext}
          disabled={!currentAnswer?.toString().trim() || isLoading}
        >
          {isLoading ? 'Mentés...' : isLastStep ? 'Befejezés' : 'Következő'}
        </button>
      </div>
    </section>
  )
}
