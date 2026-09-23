import React, { useState } from 'react';
import type { FormEvent } from 'react';
import styles from '../App.module.css';

interface PowerTask {
  id: number;
  expression: string;
  answer: number;
  explanation: string;
}

const powerTasks: PowerTask[] = [
  { id: 1, expression: '2^2', answer: 4, explanation: 'Grunntallet er 2, og eksponenten er 2. Regn ut 2 x 2 = 4.' },
  { id: 2, expression: '3^2', answer: 9, explanation: '3 skal multipliseres med seg selv to ganger: 3 x 3 = 9.' },
  { id: 3, expression: '10^2', answer: 100, explanation: '10 x 10 = 100. Når 10 har eksponenten 2, får vi 100.' },
  { id: 4, expression: '2^3', answer: 8, explanation: '2 skal brukes som faktor tre ganger: 2 x 2 x 2 = 8.' },
  { id: 5, expression: '5^2', answer: 25, explanation: '5 x 5 = 25. Eksponenten 2 betyr at grunntallet brukes to ganger.' },
  { id: 6, expression: '2^5', answer: 32, explanation: '2 x 2 x 2 x 2 x 2 = 32.' },
  { id: 7, expression: '3^3', answer: 27, explanation: '3 x 3 x 3 = 27. Her er 3 både grunntallet og antallet ganger det brukes.' },
  { id: 8, expression: '10^3', answer: 1000, explanation: '10 x 10 x 10 = 1000.' },
  { id: 9, expression: '4^3', answer: 64, explanation: '4 x 4 x 4 = 16 x 4 = 64.' },
  { id: 10, expression: '2^6 + 3^2', answer: 73, explanation: 'Regn ut potensene først: 2^6 = 64 og 3^2 = 9. Deretter 64 + 9 = 73.' },
];

interface PowersPracticeProps {
  onPointsEarned: (points: number) => void;
}

interface Feedback {
  correct: boolean;
  points: number;
}

export const PowersPractice: React.FC<PowersPracticeProps> = ({ onPointsEarned }) => {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [questionStartedAt, setQuestionStartedAt] = useState(0);

  const startPractice = () => {
    setStarted(true);
    setCurrentIndex(0);
    setAnswer('');
    setFeedback(null);
    setTotalPoints(0);
    setQuestionStartedAt(Date.now());
  };

  const submitAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const task = powerTasks[currentIndex];
    const isCorrect = Number(answer.trim()) === task.answer;

    if (!isCorrect) {
      setFeedback({ correct: false, points: 0 });
      return;
    }

    const elapsedSeconds = (Date.now() - questionStartedAt) / 1000;
    const points = Math.max(10, Math.round(100 - elapsedSeconds * 3));
    setFeedback({ correct: true, points });
    setTotalPoints((currentPoints) => currentPoints + points);
    onPointsEarned(points);
  };

  const nextTask = () => {
    if (currentIndex === powerTasks.length - 1) {
      setStarted(false);
      return;
    }

    setCurrentIndex((index) => index + 1);
    setAnswer('');
    setFeedback(null);
    setQuestionStartedAt(Date.now());
  };

  if (!started) {
    return (
      <div className={styles.powersPage}>
        <div className={styles.powersIntro}>
          <span className={styles.assessmentEyebrow}>Tall og algebra</span>
          <h1>Grunntall og eksponent</h1>
          <p>Grunntallet er tallet som multipliseres med seg selv. Eksponenten forteller hvor mange ganger det skjer.</p>
        </div>
        <div className={styles.powersInfo}>
          <p>I <strong>2^5</strong> er 2 grunntallet og 5 eksponenten.</p>
          <p>Du får mellom 10 og 100 poeng for hvert riktig svar, avhengig av svartiden.</p>
        </div>
        <button type="button" className={styles.assessmentPrimaryButton} onClick={startPractice}>
          Start oppgavene
        </button>
      </div>
    );
  }

  const task = powerTasks[currentIndex];
  const progress = ((currentIndex + 1) / powerTasks.length) * 100;
  const isLastTask = currentIndex === powerTasks.length - 1;

  return (
    <div className={styles.powersPage}>
      <div className={styles.powersHeader}>
        <div>
          <span className={styles.assessmentEyebrow}>Oppgave {currentIndex + 1} av {powerTasks.length}</span>
          <h1>Grunntall og eksponent</h1>
        </div>
        <strong>{totalPoints} poeng</strong>
      </div>
      <div className={styles.assessmentProgressTrack} aria-label={`Progresjon: ${currentIndex + 1} av ${powerTasks.length}`}>
        <div className={styles.assessmentProgressBar} style={{ width: `${progress}%` }} />
      </div>
      <p className={styles.powersQuestion}>Hva blir {task.expression}?</p>
      <form className={styles.powersForm} onSubmit={submitAnswer}>
        <label htmlFor="powerAnswer">Skriv svaret ditt</label>
        <input
          id="powerAnswer"
          type="number"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Skriv svaret"
          autoFocus
          required
          disabled={feedback?.correct === true}
        />
        {!feedback && <button type="submit" className={styles.assessmentPrimaryButton}>Sjekk svaret</button>}
      </form>
      {feedback && (
        <div className={feedback.correct ? styles.powersCorrect : styles.powersWrong}>
          <strong>{feedback.correct ? `Riktig! Du fikk ${feedback.points} poeng.` : 'Ikke helt riktig ennå.'}</strong>
          <p>{task.explanation}</p>
          {feedback.correct ? (
            <button type="button" className={styles.assessmentPrimaryButton} onClick={nextTask}>
              {isLastTask ? 'Se resultat' : 'Neste oppgave'}
            </button>
          ) : (
            <button type="button" className={styles.assessmentSecondaryButton} onClick={() => setFeedback(null)}>
              Prøv igjen
            </button>
          )}
        </div>
      )}
    </div>
  );
};
