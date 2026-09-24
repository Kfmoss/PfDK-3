import React, { useState } from 'react';
import type { FormEvent } from 'react';
import styles from '../App.module.css';

interface AlgebraTask {
  id: number;
  expression: string;
  answer: number;
  explanation: string;
}

interface AlgebraLevel {
  id: 1 | 2 | 3;
  name: string;
  difficulty: string;
  description: string;
  tasks: AlgebraTask[];
}

const algebraLevels: AlgebraLevel[] = [
  {
    id: 1,
    name: 'Grønn løype',
    difficulty: 'Nivå 1',
    description: 'En flat løype med grunnleggende tall og potenser.',
    tasks: [
      { id: 1, expression: '12 + 8', answer: 20, explanation: 'Legg sammen 12 og 8: 12 + 8 = 20.' },
      { id: 2, expression: '7 x 6', answer: 42, explanation: '7 grupper med 6 blir 42.' },
      { id: 3, expression: '45 - 17', answer: 28, explanation: 'Trekk 17 fra 45: 45 - 17 = 28.' },
      { id: 4, expression: '2^2', answer: 4, explanation: '2 x 2 = 4.' },
      { id: 5, expression: '3^2', answer: 9, explanation: '3 x 3 = 9.' },
      { id: 6, expression: '100 / 4', answer: 25, explanation: '100 delt på 4 er 25.' },
      { id: 7, expression: '5 x 5', answer: 25, explanation: '5 x 5 = 25.' },
      { id: 8, expression: '10^2', answer: 100, explanation: '10 x 10 = 100.' },
      { id: 9, expression: '64 / 8', answer: 8, explanation: '64 delt på 8 er 8.' },
      { id: 10, expression: '2^3 + 1', answer: 9, explanation: '2^3 = 8, og 8 + 1 = 9.' },
    ],
  },
  {
    id: 2,
    name: 'Rød løype',
    difficulty: 'Nivå 2',
    description: 'En brattere løype med likninger og flere regneoperasjoner.',
    tasks: [
      { id: 1, expression: 'x + 7 = 19', answer: 12, explanation: 'Trekk 7 fra begge sider: x = 19 - 7 = 12.' },
      { id: 2, expression: '3x = 24', answer: 8, explanation: 'Del begge sider på 3: x = 24 / 3 = 8.' },
      { id: 3, expression: 'x - 15 = 9', answer: 24, explanation: 'Legg 15 til begge sider: x = 9 + 15 = 24.' },
      { id: 4, expression: '2x + 4 = 18', answer: 7, explanation: 'Trekk 4 fra og del på 2: x = 14 / 2 = 7.' },
      { id: 5, expression: '5x - 10 = 20', answer: 6, explanation: 'Legg 10 til og del på 5: x = 30 / 5 = 6.' },
      { id: 6, expression: '4x + 3 = 27', answer: 6, explanation: 'Trekk 3 fra og del på 4: x = 24 / 4 = 6.' },
      { id: 7, expression: '2^3 + 4', answer: 12, explanation: 'Regn ut potensen først: 8 + 4 = 12.' },
      { id: 8, expression: '3(x + 2) = 21', answer: 5, explanation: 'Del på 3 og trekk 2 fra: x = 7 - 2 = 5.' },
      { id: 9, expression: 'x / 4 = 6', answer: 24, explanation: 'Gang begge sider med 4: x = 24.' },
      { id: 10, expression: '7x + 1 = 36', answer: 5, explanation: 'Trekk 1 fra og del på 7: x = 35 / 7 = 5.' },
    ],
  },
  {
    id: 3,
    name: 'Svart løype',
    difficulty: 'Nivå 3',
    description: 'En svært bratt løype med parenteser og krevende likninger.',
    tasks: [
      { id: 1, expression: '2(x + 3) = 18', answer: 6, explanation: 'Del på 2 og trekk 3 fra: x = 9 - 3 = 6.' },
      { id: 2, expression: '3(x - 4) = 21', answer: 11, explanation: 'Del på 3 og legg 4 til: x = 7 + 4 = 11.' },
      { id: 3, expression: '4x - 2x = 18', answer: 9, explanation: 'Slå sammen leddene til 2x = 18. Da er x = 9.' },
      { id: 4, expression: '5(x + 2) - 3 = 27', answer: 4, explanation: 'Legg 3 til, del på 5 og trekk 2 fra: x = 6 - 2 = 4.' },
      { id: 5, expression: '2x + 5 = x + 14', answer: 9, explanation: 'Trekk x fra og 5 fra: x = 9.' },
      { id: 6, expression: '3(x - 2) + 4 = 19', answer: 7, explanation: 'Trekk 4 fra, del på 3 og legg 2 til: x = 5 + 2 = 7.' },
      { id: 7, expression: 'x^2 = 49', answer: 7, explanation: '7^2 = 49. Vi bruker den positive løsningen x = 7.' },
      { id: 8, expression: '2(x + 5) = 3x - 4', answer: 14, explanation: 'Utvid parentesen: 2x + 10 = 3x - 4. Da blir x = 14.' },
      { id: 9, expression: '6x - 2(2x - 3) = 14', answer: 4, explanation: 'Utvid parentesen: 6x - 4x + 6 = 14. Da er 2x = 8 og x = 4.' },
      { id: 10, expression: '3^3 + 2(4 - 1)', answer: 33, explanation: '3^3 = 27 og 2(4 - 1) = 6. Summen er 33.' },
    ],
  },
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
  const [selectedLevel, setSelectedLevel] = useState<AlgebraLevel | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [questionStartedAt, setQuestionStartedAt] = useState(0);

  const startPractice = (level: AlgebraLevel) => {
    setSelectedLevel(level);
    setStarted(true);
    setCurrentIndex(0);
    setAnswer('');
    setFeedback(null);
    setTotalPoints(0);
    setQuestionStartedAt(Date.now());
  };

  const submitAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedLevel) {
      return;
    }

    const task = selectedLevel.tasks[currentIndex];
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
    if (!selectedLevel) {
      return;
    }

    if (currentIndex === selectedLevel.tasks.length - 1) {
      setStarted(false);
      return;
    }

    setCurrentIndex((index) => index + 1);
    setAnswer('');
    setFeedback(null);
    setQuestionStartedAt(Date.now());
  };

  if (!started || !selectedLevel) {
    return (
      <div className={styles.powersPage}>
        <div className={styles.powersIntro}>
          <span className={styles.assessmentEyebrow}>Tall og algebra</span>
          <h1>Velg skilevel</h1>
          <p>Velg vanskelighetsgrad. Hver løype har 10 oppgaver.</p>
        </div>
        <div className={styles.algebraLevels}>
          {algebraLevels.map((level) => (
            <article className={`${styles.algebraLevel} ${styles[`algebraLevel${level.id}`]}`} key={level.id}>
              <div className={styles.skiSlope} aria-hidden="true">
                <span className={styles.skiTrack} />
              </div>
              <span className={styles.algebraLevelDifficulty}>{level.difficulty}</span>
              <h2>{level.name}</h2>
              <p>{level.description}</p>
              <button type="button" className={styles.algebraLevelButton} onClick={() => startPractice(level)}>
                Kjør løypa
              </button>
            </article>
          ))}
        </div>
      </div>
    );
  }

  const task = selectedLevel.tasks[currentIndex];
  const progress = ((currentIndex + 1) / selectedLevel.tasks.length) * 100;
  const isLastTask = currentIndex === selectedLevel.tasks.length - 1;

  return (
    <div className={styles.powersPage}>
      <div className={styles.powersHeader}>
        <div>
          <span className={styles.assessmentEyebrow}>{selectedLevel.name} - oppgave {currentIndex + 1} av {selectedLevel.tasks.length}</span>
          <h1>Tall og algebra</h1>
        </div>
        <strong>{totalPoints} poeng</strong>
      </div>
      <div className={styles.assessmentProgressTrack} aria-label={`Progresjon: ${currentIndex + 1} av ${selectedLevel.tasks.length}`}>
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
