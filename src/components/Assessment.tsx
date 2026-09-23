import React, { useState } from 'react';
import type { FormEvent } from 'react';
import styles from '../App.module.css';

interface MathProblem {
	id: number;
	expression: string;
	answer: number;
	category: string;
	explanation: string;
}

const mathProblems: MathProblem[] = [
	{ id: 1, expression: '7 + 8', answer: 15, category: 'Addisjon', explanation: 'Adder tallene direkte: 7 + 8 = 15.' },
	{ id: 2, expression: '23 - 9', answer: 14, category: 'Subtraksjon', explanation: 'Trekk 9 fra 23: 23 - 9 = 14.' },
	{ id: 3, expression: '6 x 7', answer: 42, category: 'Multiplikasjon', explanation: 'Bruk multiplikasjonstabellen: 6 x 7 = 42.' },
	{ id: 4, expression: '56 / 8', answer: 7, category: 'Divisjon', explanation: 'Hvor mange ganger gaar 8 opp i 56? 56 / 8 = 7.' },
	{ id: 5, expression: '18 / 3 + 5', answer: 11, category: 'Regnerekkefolge', explanation: 'Gjor divisjon for addisjon: 18 / 3 = 6, og 6 + 5 = 11.' },
	{ id: 6, expression: '4 + 3 x 6', answer: 22, category: 'Regnerekkefolge', explanation: 'Gjor multiplikasjon for addisjon: 3 x 6 = 18, og 4 + 18 = 22.' },
	{ id: 7, expression: '1/2 + 1/4', answer: 0.75, category: 'Brokregning', explanation: '1/2 = 2/4, derfor blir 2/4 + 1/4 = 3/4 = 0,75.' },
	{ id: 8, expression: '3/4 - 1/3', answer: 5 / 12, category: 'Brokregning', explanation: 'Fellesnevneren er 12: 9/12 - 4/12 = 5/12.' },
	{ id: 9, expression: '(12 - 4) x (2 + 3)', answer: 40, category: 'Parenteser', explanation: 'Regn ut parentesene: 8 x 5 = 40.' },
	{ id: 10, expression: '30 - 2 x (4 + 3)', answer: 16, category: 'Regnerekkefolge', explanation: '4 + 3 = 7, 2 x 7 = 14, og 30 - 14 = 16.' },
];

type TestStage = 'start' | 'questions' | 'results';

interface AnswerResult {
	problem: MathProblem;
	answer: string;
	correct: boolean;
	points: number;
}

interface AssessmentProps {
	onTestStart: () => void;
	onPointsEarned: (points: number) => void;
}

function parseAnswer(value: string): number {
	const cleanValue = value.trim().replace(',', '.');
	if (cleanValue.includes('/')) {
		const [numerator, denominator] = cleanValue.split('/').map(Number);
		return denominator && !Number.isNaN(numerator) ? numerator / denominator : Number.NaN;
	}
	return Number.parseFloat(cleanValue);
}

export const Assessment: React.FC<AssessmentProps> = ({ onTestStart, onPointsEarned }) => {
	const [stage, setStage] = useState<TestStage>('start');
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answer, setAnswer] = useState('');
	const [results, setResults] = useState<AnswerResult[]>([]);
	const [showExplanations, setShowExplanations] = useState(false);
	const [questionStartedAt, setQuestionStartedAt] = useState(0);

	const startTest = () => {
		setCurrentIndex(0);
		setAnswer('');
		setResults([]);
		setShowExplanations(false);
		setQuestionStartedAt(Date.now());
		onTestStart();
		setStage('questions');
	};

	const handleAnswer = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const problem = mathProblems[currentIndex];
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
		if (points > 0) {
			onPointsEarned(points);
		}
		setAnswer('');
		if (currentIndex === mathProblems.length - 1) {
			setStage('results');
		} else {
			setCurrentIndex(currentIndex + 1);
			setQuestionStartedAt(Date.now());
		}
	};

	if (stage === 'start') {
		return (
			<section className={styles.assessmentCard}>
				<div className={styles.assessmentIntro}>
					<span className={styles.assessmentEyebrow}>Kartleggingstest</span>
					<h1>Grunnleggende regneferdigheter</h1>
					<p>Testen består av 10 oppgaver med økende vanskelighetsgrad.</p>
				</div>
				<div className={styles.assessmentInfo}>
					<p>Svar med heltall, desimaltall eller brøk, for eksempel <code>2/3</code>.</p>
					<p>Du får ingen tilbakemelding underveis og kan bruke så lang tid du vil.</p>
				</div>
				<button type="button" className={styles.assessmentPrimaryButton} onClick={startTest}>Start testen</button>
			</section>
		);
	}

	if (stage === 'questions') {
		const problem = mathProblems[currentIndex];
		const progress = ((currentIndex + 1) / mathProblems.length) * 100;

		return (
			<section className={styles.assessmentCard}>
				<div className={styles.assessmentProgressHeader}>
					<span>Oppgave {currentIndex + 1} av {mathProblems.length}</span>
					<span>{problem.category}</span>
				</div>
				<div className={styles.assessmentProgressTrack} aria-label={`Progresjon: ${currentIndex + 1} av ${mathProblems.length}`}>
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
		);
	}

	const correctCount = results.filter((result) => result.correct).length;
	const incorrectResults = results.filter((result) => !result.correct);

	return (
		<section className={styles.assessmentCard}>
			<div className={styles.assessmentIntro}>
				<span className={styles.assessmentEyebrow}>Ferdig</span>
				<h1>Resultat</h1>
				<p>Du hadde <strong>{correctCount} av {mathProblems.length}</strong> riktige.</p>
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
			<button type="button" className={styles.assessmentPrimaryButton} onClick={startTest}>Ta testen på nytt</button>
		</section>
	);
};
