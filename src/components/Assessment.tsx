import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import styles from '../App.module.css';
import logo from '../assets/mat_capybara_logo.png';
import popcorn1 from '../assets/popcorn1.png';
import popcorn2 from '../assets/popcorn2.png';
import popcorn3 from '../assets/popcorn3.png';
import { CelebrationOverlay } from './CelebrationOverlay.tsx';

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
type AnswerAnimation = 'idle' | 'correct' | 'incorrect';
const TEST_DURATION_SECONDS = 10 * 60;

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

function getTaskHelp(category: string): string {
	switch (category) {
		case 'Addisjon':
			return 'Eksempel: Ved 8 + 3 kan du starte på 8 og telle tre steg videre. Bruk samme metode med tallene i oppgaven.';
		case 'Subtraksjon':
			return 'Eksempel: Ved 12 - 4 kan du telle fire steg bakover fra 12. Gjør tilsvarende med tallene i oppgaven.';
		case 'Multiplikasjon':
			return 'Eksempel: 3 x 4 betyr tre grupper med fire. Bruk gangetabellen eller tell gruppene.';
		case 'Divisjon':
			return 'Eksempel: 12 / 3 spør hvor mange grupper på tre som får plass i tolv. Tell gruppene, og bruk samme idé i oppgaven.';
		case 'Regnerekkefolge':
			return 'Eksempel: I 2 + 3 x 4 regner du multiplikasjonen før addisjonen. Se etter hvilken regneoperasjon som skal gjøres først.';
		case 'Brokregning':
			return 'Eksempel: Når brøker har samme nevner, legger du sammen tellerne og beholder nevneren.';
		case 'Parenteser':
			return 'Eksempel: I 3 x (2 + 4) regner du inni parentesen først. Deretter bruker du tallet utenfor parentesen.';
		default:
			return 'Les oppgaven nøye, finn ut hvilken regneoperasjon den spør etter, og bruk framgangsmåten fra eksempelet som passer best.';
	}
}

export const Assessment: React.FC<AssessmentProps> = ({ onTestStart, onPointsEarned, onNavigateToAlgebra }) => {
	const [stage, setStage] = useState<TestStage>('start');
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answer, setAnswer] = useState('');
	const [showTaskHelp, setShowTaskHelp] = useState(false);
	const [results, setResults] = useState<AnswerResult[]>([]);
	const [showExplanations, setShowExplanations] = useState(false);
	const [questionStartedAt, setQuestionStartedAt] = useState(0);
	const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION_SECONDS);
	const [totalPoints, setTotalPoints] = useState(0);
	const [answerAnimation, setAnswerAnimation] = useState<AnswerAnimation>('idle');
	const [showCompletionCelebration, setShowCompletionCelebration] = useState(false);
	const [testProblems, setTestProblems] = useState<MathProblem[]>(createRandomTestProblems);
	const minutesRemaining = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
	const secondsRemaining = (timeRemaining % 60).toString().padStart(2, '0');

	useEffect(() => {
		if (stage !== 'questions') {
			return;
		}

		const timerId = window.setInterval(() => {
			setTimeRemaining((remaining) => Math.max(0, remaining - 1));
		}, 1000);

		return () => window.clearInterval(timerId);
	}, [stage]);

	useEffect(() => {
		if (stage !== 'questions' || timeRemaining !== 0) {
			return;
		}

		setStage('results');
		setShowCompletionCelebration(true);
	}, [stage, timeRemaining]);

	useEffect(() => {
		if (!showCompletionCelebration) {
			return;
		}

		const celebrationTimeout = window.setTimeout(() => setShowCompletionCelebration(false), 4200);
		return () => window.clearTimeout(celebrationTimeout);
	}, [showCompletionCelebration]);

	const animateAnswer = (animation: Exclude<AnswerAnimation, 'idle'>) => {
		setAnswerAnimation(animation);
		window.setTimeout(() => setAnswerAnimation('idle'), animation === 'correct' ? 1500 : 2800);
	};

	const startTest = () => {
		setTestProblems(createRandomTestProblems());
		setCurrentIndex(0);
		setAnswer('');
		setShowTaskHelp(false);
		setResults([]);
		setShowExplanations(false);
		setTotalPoints(0);
		setAnswerAnimation('idle');
		setShowCompletionCelebration(false);
		setTimeRemaining(TEST_DURATION_SECONDS);
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
		animateAnswer(correct ? 'correct' : 'incorrect');
		if (points > 0) {
			setTotalPoints((currentPoints) => currentPoints + points);
			onPointsEarned(points);
		}
		setAnswer('');
		setShowTaskHelp(false);
		if (currentIndex === testProblems.length - 1) {
			setStage('results');
			setShowCompletionCelebration(true);
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
						<p>Du har 10 minutter på testen og får ingen tilbakemelding underveis.</p>
					</div>
					<button type="button" className={styles.assessmentPrimaryButton} onClick={startTest}>Start testen</button>
				</section>
			</div>
		);
	}

	if (stage === 'questions') {
		const problem = testProblems[currentIndex];
		const progress = ((currentIndex + 1) / testProblems.length) * 100;
		const popcornImages = [popcorn1, popcorn2, popcorn3];
		const popcornPiecesPerAnswer = 6;

		return (
			<div className={styles.assessmentTestLayout}>
				<div className={styles.assessmentTestSidebar}>
					<div className={styles.assessmentMascot}>
						<img
							src={logo}
							alt="Mat-Capybara"
							className={`${styles.assessmentLogo} ${answerAnimation === 'incorrect' ? styles.assessmentLogoIncorrect : ''}`}
						/>
						{answerAnimation === 'correct' && <CelebrationOverlay />}
					</div>
					<div
						className={styles.assessmentJar}
						role="progressbar"
						aria-label={`Popcornkrukke: ${results.length} av ${testProblems.length} oppgaver besvart`}
						aria-valuemin={0}
						aria-valuemax={testProblems.length}
						aria-valuenow={results.length}
					>
						<div className={styles.assessmentJarInterior}>
							<div
								className={`${styles.assessmentJarFill} ${results.length > 0 ? styles.assessmentJarFillActive : ''}`}
								style={{ height: `${(results.length / testProblems.length) * 100}%` }}
							>
								{results.flatMap((result, answerIndex) =>
									Array.from({ length: popcornPiecesPerAnswer }, (_, pieceIndex) => (
									<img
											src={popcornImages[(answerIndex * popcornPiecesPerAnswer + pieceIndex) % popcornImages.length]}
										alt=""
										className={styles.assessmentJarPopcorn}
										key={`${result.problem.id}-${pieceIndex}`}
									/>
									)),
								)}
							</div>
						</div>
					</div>
				</div>
				<section className={`${styles.assessmentCard} ${styles.assessmentTestCard}`}>
					<div className={styles.assessmentTaskTitle}>
						<span className={styles.assessmentEyebrow}>Kartleggingstest</span>
						<h1>Grunnleggende regneferdigheter</h1>
					</div>
					<div
						className={`${styles.assessmentTimer} ${timeRemaining <= 60 ? styles.assessmentTimerWarning : ''}`}
						role="timer"
						aria-label={`Tid igjen ${minutesRemaining}:${secondsRemaining}`}
					>
						<span>Tid igjen</span>
						<strong>{minutesRemaining}:{secondsRemaining}</strong>
					</div>
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
						<div className={styles.assessmentActions}>
							<button type="submit" className={styles.assessmentPrimaryButton}>Neste oppgave</button>
							<button
								type="button"
								className={styles.assessmentHelpButton}
								aria-expanded={showTaskHelp}
								aria-controls="assessmentTaskHelp"
								onClick={() => setShowTaskHelp((visible) => !visible)}
							>
								Hjelp meg
							</button>
						</div>
						{showTaskHelp && (
							<div className={styles.assessmentHelp} id="assessmentTaskHelp" role="status">
								<p>{getTaskHelp(problem.category)}</p>
							</div>
						)}
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
		<>
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
		{showCompletionCelebration && <CelebrationOverlay fullScreen />}
		</>
	);
};
