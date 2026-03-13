import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import './OnBoarding.scss'

const QUESTIONS = [
  '1. kerdes',
  '2. kerdes',
  '3. kerdes',
  '4. kerdes',
  '5. kerdes',
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const setOnboardingComplete = useAuthStore((state) => state.setOnboardingComplete)
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(''))

  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === QUESTIONS.length - 1
  const currentQuestion = QUESTIONS[stepIndex]
  const currentAnswer = answers[stepIndex]

  const handleAnswerChange = (event) => {
    const nextAnswers = [...answers]
    nextAnswers[stepIndex] = event.target.value
    setAnswers(nextAnswers)
  }

  const handleFinishOnboarding = () => {
    if (user?.uid) {
      localStorage.setItem(`onboarding_complete_${user.uid}`, '1')
      localStorage.setItem(`onboarding_answers_${user.uid}`, JSON.stringify(answers))
    }
    setOnboardingComplete(true)
    navigate('/user/dashboard', { replace: true })
  }

  const handleNext = () => {
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
  }

  return (
    <section className='onboarding-page' aria-labelledby='onboarding-title'>
      <h1 id='onboarding-title' className='onboarding-page__title'>
        Onboarding
      </h1>
      <p className='onboarding-page__subtitle'>
        Valszolj a kerdesekre, majd folytatjuk a dashboardra.
      </p>

      <p className='onboarding-page__progress'>
        Kerdes {stepIndex + 1} / {QUESTIONS.length}
      </p>

      <div key={stepIndex} className='onboarding-card'>
        <h2 className='onboarding-card__question'>{currentQuestion}</h2>

        <label className='onboarding-card__label' htmlFor='onboarding-answer'>
          Valasz
        </label>
        <input
          id='onboarding-answer'
          className='onboarding-card__input'
          type='text'
          value={currentAnswer}
          onChange={handleAnswerChange}
          placeholder='Ird be a valaszod...'
          autoFocus
        />
      </div>

      <div className='onboarding-page__actions'>
        <button
          type='button'
          className='onboarding-page__button onboarding-page__button--ghost'
          onClick={handleBack}
          disabled={isFirstStep}
        >
          Elozo
        </button>

        <button
          type='button'
          className='onboarding-page__button onboarding-page__button--primary'
          onClick={handleNext}
          disabled={!currentAnswer.trim()}
        >
          {isLastStep ? 'Befejezes' : 'Kovetkezo'}
        </button>
      </div>
    </section>
  )
}
