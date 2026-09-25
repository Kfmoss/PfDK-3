import React, { useState } from 'react';
import type { FormEvent } from 'react';
import styles from '../App.module.css';
import logo from '../assets/mat_capybara_logo.png';

interface MathProblem {
	id: number;
	expression: string;
	answer: number;
	category: string;
	explanation: string;
}

const randomInteger = (minimum: number, maximum: number) =>
	Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

function createRandomTestProblems(): MathProblem[] {
	const problems: MathProblem[] = [];

	const addProblem = (expression: string, answer: number, category: string, explanation: string) => {
		problems.push({ id: problems.length + 1, expression, answer, category, explanation });
	};

	const addBasicProblem = () => {
		const type = randomInteger(1, 4);
		if (type === 1) {
			const first = randomInteger(5, 50);
			const second = randomInteger(1, 50);
			addProblem(`${first} + ${second}`, first + second, 'Addisjon', `Adder tallene direkte: ${first} + ${second} = ${first + second}.`);
		} else if (type === 2) {
			const first = randomInteger(20, 80);
			const second = randomInteger(1, first - 1);
			addProblem(`${first} - ${second}`, first - second, 'Subtraksjon', `Trekk ${second} fra ${first}: ${first} - ${second} = ${first - second}.`);
		} else if (type === 3) {
			const first = randomInteger(2, 12);
			const second = randomInteger(2, 12);
			addProblem(`${first} x ${second}`, first * second, 'Multiplikasjon', `Bruk multiplikasjonstabellen: ${first} x ${second} = ${first * second}.`);
		} else {
			const divisor = randomInteger(2, 12);
			const quotient = randomInteger(2, 12);
			const dividend = divisor * quotient;
			addProblem(`${dividend} / ${divisor}`, quotient, 'Divisjon', `${dividend} delt på ${divisor} er ${quotient}.`);
		}
	};

	const addOrderOfOperationsProblem = () => {
		const first = randomInteger(2, 10);
		const second = randomInteger(2, 8);
		const third = randomInteger(1, 12);
		const answer = first + second * third;
		addProblem(`${first} + ${second} x ${third}`, answer, 'Regnerekkefolge', `Gjor multiplikasjon for addisjon: ${second} x ${third} = ${second * third}, og ${first} + ${second * third} = ${answer}.`);
	};

	const addFractionProblem = () => {
		const denominator = randomInteger(2, 8);
		const firstNumerator = randomInteger(1, denominator - 1);
		const secondNumerator = randomInteger(1, denominator - 1);
		const answer = (firstNumerator + secondNumerator) / denominator;
		addProblem(`${firstNumerator}/${denominator} + ${secondNumerator}/${denominator}`, answer, 'Brokregning', `Legg sammen tellerne: ${firstNumerator}/${denominator} + ${secondNumerator}/${denominator} = ${firstNumerator + secondNumerator}/${denominator}.`);
	};

	const addParenthesesProblem = () => {
		const first = randomInteger(2, 10);
		const second = randomInteger(1, 8);
		const multiplier = randomInteger(2, 6);
		const answer = (first + second) * multiplier;
		addProblem(`(${first} + ${second}) x ${multiplier}`, answer, 'Parenteser', `Regn ut parentesen først: ${first} + ${second} = ${first + second}, og ${first + second} x ${multiplier} = ${answer}.`);
	};

	for (let index = 0; index < 3; index += 1) addBasicProblem();
	for (let index = 0; index < 3; index += 1) addOrderOfOperationsProblem();
	for (let index = 0; index < 2; index += 1) addFractionProblem();
	for (let index = 0; index < 2; index += 1) addParenthesesProblem();

	return problems;
}

type TestStage = 'start' | 'questions' | 'results';
type LogoAnimation = 'idle' | 'correct' | 'incorrect';

interface AnswerResult {
	problem: MathProblem;
	answer: string;
	correct: boolean;
	points: number;
}

interface AssessmentProps {
	onTestStart: () => void;
	onPointsEarned: (points: number) => void;
	onNavigateToAlgebra: () => void;
}

function parseAnswer(value: string): number {
	const cleanValue = value.trim().replace(',', '.');
	if (cleanValue.includes('/')) {
		const [numerator, denominator] = cleanValue.split('/').map(Number);
		return denominator && !Number.isNaN(numerator) ? numerator / denominator : Number.NaN;
	}
	return Number.parseFloat(cleanValue);
}

export const Assessment: React.FC<AssessmentProps> = ({ onTestStart, onPointsEarned, onNavigateToAlgebra }) => {
	const [stage, setStage] = useState<TestStage>('start');
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answer, setAnswer] = useState('');
	const [results, setResults] = useState<AnswerResult[]>([]);
	const [showExplanations, setShowExplanations] = useState(false);
	const [questionStartedAt, setQuestionStartedAt] = useState(0);
	const [totalPoints, setTotalPoints] = useState(0);
	const [logoAnimation, setLogoAnimation] = useState<LogoAnimation>('idle');
	const [testProblems, setTestProblems] = useState<MathProblem[]>(createRandomTestProblems);

	const animateLogo = (animation: Exclude<LogoAnimation, 'idle'>) => {
		setLogoAnimation(animation);
		window.setTimeout(() => setLogoAnimation('idle'), animation === 'correct' ? 650 : 2800);
	};

	const startTest = () => {
		setTestProblems(createRandomTestProblems());
		setCurrentIndex(0);
		setAnswer('');
		setResults([]);
		setShowExplanations(false);
		setTotalPoints(0);
		setLogoAnimation('idle');
		setQuestionStartedAt(Date.now());
		onTestStart();
		setStage('questions');
	};

	const handleAnswer = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const problem = testProblems[currentIndex];
		const parsedAnswer = parseAnswer(answer);
		const correct = !Number.isNaN(parsedAnswer) && Math.abs(parsedAnswer - problem.answer) < 0.0001;
		const elapsedSeconds = (Date.now() - questionStartedAt) / 1000;
		const points = correct ? Math.max(10, Math.round(100 - elapsedSeconds * 3)) : 0;
		const result: AnswerResult = {
			problem,
			answer,
			correct,
			points,
		};
		const nextResults = [...results, result];

		setResults(nextResults);
		animateLogo(correct ? 'correct' : 'incorrect');
		if (points > 0) {
			setTotalPoints((currentPoints) => currentPoints + points);
			onPointsEarned(points);
		}
		setAnswer('');
		if (currentIndex === testProblems.length - 1) {
			setStage('results');
		} else {
			setCurrentIndex(currentIndex + 1);
			setQuestionStartedAt(Date.now());
		}
	};

	if (stage === 'start') {
		return (
			<div className={styles.assessmentWithLogo}>
				<img src={logo} alt="Mat-Capybara" className={styles.assessmentLogo} />
				<section className={styles.assessmentCard}>
					<div className={styles.assessmentIntro}>
						<span className={styles.assessmentEyebrow}>Kartleggingstest</span>
						<h1>Grunnleggende regneferdigheter</h1>
						<p>Testen består av 10 tilfeldig valgte oppgaver med økende vanskelighetsgrad.</p>
					</div>
					<div className={styles.assessmentInfo}>
						<p>Svar med heltall, desimaltall eller brøk, for eksempel <code>2/3</code>.</p>
						<p>Du får ingen tilbakemelding underveis og kan bruke så lang tid du vil.</p>
					</div>
					<button type="button" className={styles.assessmentPrimaryButton} onClick={startTest}>Start testen</button>
				</section>
			</div>
		);
	}

	if (stage === 'questions') {
		const problem = testProblems[currentIndex];
		const progress = ((currentIndex + 1) / testProblems.length) * 100;

		return (
			<div className={styles.assessmentWithLogo}>
				<img
					src={logo}
					alt="Mat-Capybara"
					className={`${styles.assessmentLogo} ${styles[`assessmentLogo${logoAnimation.charAt(0).toUpperCase()}${logoAnimation.slice(1)}`]}`}
				/>
				<section className={styles.assessmentCard}>
					<div className={styles.assessmentProgressHeader}>
						<span>Oppgave {currentIndex + 1} av {testProblems.length}</span>
						<span>Poeng: {totalPoints} · {problem.category}</span>
					</div>
					<div className={styles.assessmentProgressTrack} aria-label={`Progresjon: ${currentIndex + 1} av ${testProblems.length}`}>
						<div className={styles.assessmentProgressBar} style={{ width: `${progress}%` }} />
					</div>
					<div className={styles.assessmentExpression} aria-live="polite">{problem.expression}</div>
					<form className={styles.assessmentForm} onSubmit={handleAnswer}>
						<label htmlFor="answerInput">Skriv svaret ditt</label>
						<input
							id="answerInput"
							type="text"
							value={answer}
							onChange={(event) => setAnswer(event.target.value)}
							placeholder="For eksempel 15 eller 3/4"
							autoFocus
							required
							autoComplete="off"
						/>
						<button type="submit" className={styles.assessmentPrimaryButton}>Neste oppgave</button>
					</form>
				</section>
			</div>
		);
	}

	const correctCount = results.filter((result) => result.correct).length;
	const incorrectResults = results.filter((result) => !result.correct);
	const recommendedLevel = correctCount <= 3 ? 1 : correctCount <= 7 ? 2 : 3;
	const recommendationText = correctCount <= 3
		? 'Start med nivå 1, den grønne og flate løypa.'
		: correctCount <= 7
			? 'Prøv nivå 2, den røde og brattere løypa.'
			: 'Du kan prøve nivå 3, den svarte og mest krevende løypa.';

	return (
		<section className={styles.assessmentCard}>
			<div className={styles.assessmentIntro}>
				<span className={styles.assessmentEyebrow}>Ferdig</span>
				<h1>Resultat</h1>
				<p>Du hadde <strong>{correctCount} av {testProblems.length}</strong> riktige.</p>
			</div>
			{incorrectResults.length > 0 ? (
				<div className={styles.incorrectAnswers}>
					<h2>Oppgaver du kan øve mer på</h2>
					{incorrectResults.map((result) => (
						<article className={styles.incorrectAnswer} key={result.problem.id}>
							<div className={styles.incorrectAnswerHeader}>
								<strong>Oppgave {result.problem.id}: {result.problem.expression}</strong>
								<span>Ditt svar: {result.answer || '(tomt)'}</span>
							</div>
							<p>Riktig svar: <strong>{result.problem.answer}</strong></p>
							{showExplanations && <p className={styles.explanation}><strong>Forklaring:</strong> {result.problem.explanation}</p>}
						</article>
					))}
					{!showExplanations && <button type="button" className={styles.assessmentSecondaryButton} onClick={() => setShowExplanations(true)}>Vis trinnvise forklaringer</button>}
				</div>
			) : (
				<p className={styles.assessmentSuccess}>Fantastisk jobbet! Du svarte riktig på alle oppgavene.</p>
			)}
			<div className={styles.assessmentRecommendation}>
				<span className={styles.assessmentEyebrow}>Anbefalt videre</span>
				<h2>Nivå {recommendedLevel} i Tall og algebra</h2>
				<p>{recommendationText}</p>
				<button type="button" className={styles.assessmentPrimaryButton} onClick={onNavigateToAlgebra}>
					Gå til Tall og algebra
				</button>
			</div>
			<button type="button" className={styles.assessmentPrimaryButton} onClick={startTest}>Ta testen på nytt</button>
		</section>
	);
};
