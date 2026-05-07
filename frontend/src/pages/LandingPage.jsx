import { Link } from 'react-router-dom'
import './LandingPage.scss'

const highlights = [
	{ label: 'Naponta aktiv felhasznalo', value: '1 200+' },
	{ label: 'Naplozott etkezes / het', value: '18 000+' },
	{ label: 'Atlagos napi megtartas', value: '87%' },
]

const featureCards = [
	{
		title: 'Gyors etkezesnaplo',
		text: 'Masodpercek alatt rogzitheted a napi etkezeseidet, stabil rutinra epitve a tervezest.',
		tone: 'primary',
	},
	{
		title: 'Intelligens food search',
		text: 'Talalj eteleket gyorsan, rendezetten, majd add a naplohoz egyetlen mozdulattal.',
		tone: 'accent',
	},
	{
		title: 'Heti trend attekintes',
		text: 'Lathato mintakat kapsz kaloria es makro szinten, hogy jobb donteseket hozz nap mint nap.',
		tone: 'secondary',
	},
]

const steps = [
	{
		title: 'Cel beallitasa',
		text: 'Add meg az alapadataidat es a celodat, az app ehhez igazodva mutatja az iranyt.',
	},
	{
		title: 'Napi rogzites',
		text: 'Etkezesenkent vezeted, mit ettel, mennyit es mikor. A napi kep azonnal tisztabb lesz.',
	},
	{
		title: 'Folyamatos finomhangolas',
		text: 'A heti statisztikak alapjan latod, mi mukodik, es mit erdemes korrigalni.',
	},
]

export function LandingPage() {
	return (
		<section className='landing-page'>
			<header className='landing-page__hero'>
				<div className='landing-page__hero-copy'>
					<p className='landing-page__eyebrow'>Tudatos etkezes, letisztult rendszer</p>
					<h1 className='landing-page__title'>
						Epitd fel a napi rutint ugy, hogy latszodjon a haladasod.
					</h1>
					<p className='landing-page__lead'>
						A LockIn egy atlathato etkezeskezelo felulet, ahol a naplozas, a keresett etelek
						es a statisztikak egy helyen tamogatjak a celjaidat.
					</p>

					<div className='landing-page__hero-actions'>
						<Link to='/register' className='landing-page__button landing-page__button--primary'>
							Ingyenes kezdes
						</Link>
						<Link to='/login' className='landing-page__button landing-page__button--ghost'>
							Mar van fiokom
						</Link>
					</div>
				</div>
			</header>

			<section className='landing-page__highlights' aria-label='Kiemelt mutatok'>
				{highlights.map((item) => (
					<article className='landing-page__highlight' key={item.label}>
						<p className='landing-page__highlight-value'>{item.value}</p>
						<p className='landing-page__highlight-label'>{item.label}</p>
					</article>
				))}
			</section>

			<section className='landing-page__features' id='features'>
				<header className='landing-page__section-header'>
					<p className='landing-page__section-eyebrow'>Ami miatt konnyu hasznalni</p>
					<h2 className='landing-page__section-title'>Minden funkcio egy ertelmes folyamatba rendezve</h2>
				</header>

				<div className='landing-page__feature-grid'>
					{featureCards.map((feature) => (
						<article className={`landing-page__feature-card is-${feature.tone}`} key={feature.title}>
							<h3 className='landing-page__feature-title'>{feature.title}</h3>
							<p className='landing-page__feature-text'>{feature.text}</p>
						</article>
					))}
				</div>
			</section>

			<section className='landing-page__workflow' aria-label='Mukodes roviden'>
				<header className='landing-page__section-header'>
					<p className='landing-page__section-eyebrow'>Hogyan mukodik?</p>
					<h2 className='landing-page__section-title'>Harom lepes, amit tenyleg tartani tudsz</h2>
				</header>

				<ol className='landing-page__steps'>
					{steps.map((step, index) => (
						<li className='landing-page__step' key={step.title}>
							<span className='landing-page__step-index'>0{index + 1}</span>
							<div>
								<h3 className='landing-page__step-title'>{step.title}</h3>
								<p className='landing-page__step-text'>{step.text}</p>
							</div>
						</li>
					))}
				</ol>
			</section>

			<section className='landing-page__bottom-cta'>
				<p className='landing-page__bottom-cta-eyebrow'>Kesz vagy a stabil rutinra?</p>
				<h2 className='landing-page__bottom-cta-title'>Indulj el ma, es epits merheto fejlodest hetek alatt.</h2>
				<Link to='/register' className='landing-page__button landing-page__button--primary'>
					Regisztralok
				</Link>
			</section>
		</section>
	)
}
