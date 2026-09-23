// src/components/MainContent.tsx
import React, { useState } from 'react';
import styles from '../App.module.css';
import logo from '../assets/mat_capybara_logo.jpg'; // Husk å legge logoen her
import { Zap, Play, ChevronRight, Wand2 } from 'lucide-react';
import { Assessment } from './Assessment';

// Mock-data for bruker
interface UserStatus {
  points: number;
  level: number;
  unlockedOutfit: string;
}

interface MainContentProps {
  activeView: string;
  onSetView: (view: string) => void;
}

export const MainContent: React.FC<MainContentProps> = ({ activeView, onSetView }) => {
  // Mock-tilstand for spill-elementer
  const [user, setUser] = useState<UserStatus>({
    points: 1250,
    level: 5,
    unlockedOutfit: 'Klassisk Genser',
  });

  const startAssessment = () => {
    setUser((currentUser) => ({ ...currentUser, level: 1, points: 0 }));
  };

  const addAssessmentPoints = (points: number) => {
    setUser((currentUser) => ({ ...currentUser, points: currentUser.points + points }));
  };

  const renderContent = () => {
    switch (activeView) {
      case 'start':
        return (
          <div className={styles.welcomePage}>
            <div className={styles.hero}>
              <img src={logo} alt="Mat-Capybara Logo" className={styles.mainLogo} />
              <h1>Velkommen til mat-capybara!</h1>
              <p>Din interaktive guide gjennom VG1 1P-matematikk.</p>
            </div>

            <div className={styles.actionCards}>
              <button onClick={() => onSetView('assessment')} className={styles.cardPrimary}>
                <Zap size={32} />
                <h2>Ta en kartleggingstest</h2>
                <p>Finn ut dine sterke sider og hva du bør øve på.</p>
                <ChevronRight />
              </button>
              <button onClick={() => onSetView('topics')} className={styles.cardSecondary}>
                <Play size={32} />
                <h2>Gå rett til oppgaver</h2>
                <p>Velg et tema fra listen til venstre og start øvingen.</p>
                <ChevronRight />
              </button>
            </div>
          </div>
        );
      case 'mapping':
      case 'assessment':
        return (
          <div className={styles.assessmentPage}>
            <Assessment onTestStart={startAssessment} onPointsEarned={addAssessmentPoints} />
          </div>
        );
      case 'topics':
        return (
          <div className={styles.page}>
            <h1>Emnevalg</h1>
            <p>Bruk listen til venstre for å velge et spesifikt tema.</p>
            <p>Du har valgt: <strong>Ingenting ennå</strong></p>
          </div>
        );
      case 'math_play':
        return (
          <div className={styles.page}>
            <h1>MatteMagi / Spill</h1>
            <p>Kjappe, tilfeldige oppgaver for å tjene ekstra poeng!</p>
            <button className={styles.gameBtn}><Play /> Start Tilfeldig Utfordring</button>
          </div>
        );
      default:
        return (
          <div className={styles.page}>
            <h1>Tema: {activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h1>
            <p>Oppgaver for dette temaet laster...</p>
            <div className={styles.mockExercises}>[ Oppgaveliste her ]</div>
          </div>
        );
    }
  };

  return (
    <main className={styles.mainContent}>
      {/* Gamification Header */}
      <header className={styles.mainHeader}>
        <div className={styles.scoreBoard}>
          <div className={styles.stat}><span className={styles.label}>Nivå:</span> <span className={styles.value}>{user.level}</span></div>
          <div className={styles.stat}><span className={styles.label}>Poeng:</span> <span className={styles.value}>{user.points}</span></div>
          <div className={styles.stat}><span className={styles.label}>Antrekk:</span> <span className={styles.value}>{user.unlockedOutfit}</span></div>
        </div>
        <button className={styles.shopBtn}><Wand2 /> Til Capybara-Butikken</button>
      </header>

      {/* Dynamic Content */}
      <div className={styles.contentArea}>
        {renderContent()}
      </div>
    </main>
  );
};