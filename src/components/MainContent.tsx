// src/components/MainContent.tsx
import React, { useState } from 'react';
import type { FormEvent } from 'react';
import styles from '../App.module.css';
import logo from '../assets/mat_capybara_logo.png'; // Husk å legge logoen her
import gameBoard from '../assets/Oppgave_2_uke37.jpg';
import { Zap, Play, ChevronRight, Wand2 } from 'lucide-react';
import { Assessment } from './Assessment';
import fig1 from '../assets/fig1.png';
import fig2 from '../assets/fig2.png';
import fig3 from '../assets/fig3.png';
import fig4 from '../assets/fig4.png';
import fig5 from '../assets/fig5.png';
import fig6 from '../assets/fig6.png';
import fig7 from '../assets/fig7.png';
import fig9 from '../assets/fig9.png';
import fig10 from '../assets/fig10.png';
import fig11 from '../assets/fig11.png';
import fig12 from '../assets/fig12.png';
import fig13 from '../assets/fig13.png';
import fig14 from '../assets/fig14.png';
import fig15 from '../assets/fig15.png';

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

interface ShopItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

const shopItems: ShopItem[] = [
  { id: 'fig1', name: 'Figur 1', price: 500, image: fig1 },
  { id: 'fig2', name: 'Figur 2', price: 700, image: fig2 },
  { id: 'fig3', name: 'Figur 3', price: 900, image: fig3 },
  { id: 'fig4', name: 'Figur 4', price: 1100, image: fig4 },
  { id: 'fig5', name: 'Figur 5', price: 1300, image: fig5 },
  { id: 'fig6', name: 'Figur 6', price: 1500, image: fig6 },
  { id: 'fig7', name: 'Figur 7', price: 1650, image: fig7 },
  { id: 'fig9', name: 'Figur 9', price: 1800, image: fig9 },
  { id: 'fig10', name: 'Figur 10', price: 600, image: fig10 },
  { id: 'fig11', name: 'Figur 11', price: 800, image: fig11 },
  { id: 'fig12', name: 'Figur 12', price: 1000, image: fig12 },
  { id: 'fig13', name: 'Figur 13', price: 1200, image: fig13 },
  { id: 'fig14', name: 'Figur 14', price: 1500, image: fig14 },
  { id: 'fig15', name: 'Figur 15', price: 1750, image: fig15 },
];

export const MainContent: React.FC<MainContentProps> = ({ activeView, onSetView }) => {
  // Mock-tilstand for spill-elementer
  const [user, setUser] = useState<UserStatus>({
    points: 0,
    level: 1,
    unlockedOutfit: 'Klassisk Genser',
  });
  const [ownedItems, setOwnedItems] = useState<string[]>([]);
  const [activeOutfit, setActiveOutfit] = useState<ShopItem | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameAnswer, setGameAnswer] = useState('');
  const [gameStartedAt, setGameStartedAt] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameFeedback, setGameFeedback] = useState<'idle' | 'wrong' | 'correct'>('idle');

  const startAssessment = () => {
    setUser((currentUser) => ({ ...currentUser, level: 1, points: 0 }));
  };

  const addAssessmentPoints = (points: number) => {
    setUser((currentUser) => ({ ...currentUser, points: currentUser.points + points }));
  };

  const buyItem = (item: ShopItem) => {
    if (ownedItems.includes(item.id) || user.points < item.price) {
      return;
    }

    setUser((currentUser) => ({
      ...currentUser,
      points: currentUser.points - item.price,
      unlockedOutfit: item.name,
    }));
    setActiveOutfit(item);
    setOwnedItems((currentItems) => [...currentItems, item.id]);
  };

  const startMathGame = () => {
    setGameAnswer('');
    setGameStartedAt(Date.now());
    setGameCompleted(false);
    setGameFeedback('idle');
    setGameStarted(true);
  };

  const submitMathGameAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (gameCompleted) {
      return;
    }

    if (Number(gameAnswer.trim()) !== 2) {
      setGameFeedback('wrong');
      setGameAnswer('');
      return;
    }

    const elapsedSeconds = (Date.now() - gameStartedAt) / 1000;
    const points = Math.max(10, Math.round(100 - elapsedSeconds * 3));
    setUser((currentUser) => ({ ...currentUser, points: currentUser.points + points }));
    setGameCompleted(true);
    setGameFeedback('correct');
  };

  const renderMathGame = () => {
    if (!gameStarted) {
      return (
        <div className={styles.mathGamePage}>
          <div className={styles.mathGameIntro}>
            <span className={styles.assessmentEyebrow}>Matalek / Spill</span>
            <h1>Finn riktig togstrekning</h1>
            <p>Tell hvor mange spor som går mellom to byer på brettet.</p>
          </div>
          <button type="button" className={styles.assessmentPrimaryButton} onClick={startMathGame}>
            Start utfordringen
          </button>
        </div>
      );
    }

    return (
      <div className={styles.mathGamePage}>
        <div className={styles.mathGameIntro}>
          <span className={styles.assessmentEyebrow}>Matalek / Spill</span>
          <h1>Finn riktig togstrekning</h1>
          <p>Hvor mange spor går direkte mellom <strong>London</strong> og <strong>Amsterdam</strong>?</p>
        </div>
        <div className={styles.mathGameImageFrame}>
          <img src={gameBoard} alt="Brett med byer og togstrekninger" className={styles.mathGameImage} />
        </div>
        <form className={styles.mathGameForm} onSubmit={submitMathGameAnswer}>
          <label htmlFor="gameAnswer">Antall spor</label>
          <input
            id="gameAnswer"
            type="number"
            min="0"
            step="1"
            value={gameAnswer}
            onChange={(event) => setGameAnswer(event.target.value)}
            placeholder="Skriv antall spor"
            autoFocus
            required
            disabled={gameCompleted}
          />
          <button type="submit" className={styles.assessmentPrimaryButton} disabled={gameCompleted}>
            Sjekk svaret
          </button>
        </form>
        {gameFeedback === 'wrong' && <p className={styles.mathGameError}>Det var ikke riktig. Tell sporene en gang til.</p>}
        {gameFeedback === 'correct' && <p className={styles.mathGameSuccess}>Riktig svar! Du fikk poeng basert på svartiden.</p>}
        {gameCompleted && <button type="button" className={styles.assessmentSecondaryButton} onClick={startMathGame}>Spill på nytt</button>}
      </div>
    );
  };

  const renderShop = () => (
    <div className={styles.shopPage}>
      <div className={styles.shopIntro}>
        <span className={styles.assessmentEyebrow}>Capybara-butikken</span>
        <h1>Velg din neste figur</h1>
        <p>Bruk poengene dine på nye antrekk og figurer.</p>
      </div>
      <div className={styles.shopGrid}>
        {shopItems.map((item) => {
          const isOwned = ownedItems.includes(item.id);
          const canBuy = user.points >= item.price;

          return (
            <article className={styles.shopItem} key={item.id}>
              <div className={styles.shopImageFrame}>
                <img src={item.image} alt={item.name} className={styles.shopImage} />
              </div>
              <div className={styles.shopItemInfo}>
                <h2>{item.name}</h2>
                <p>{item.price.toLocaleString('nb-NO')} poeng</p>
                <button
                  type="button"
                  className={styles.shopBuyButton}
                  onClick={() => buyItem(item)}
                  disabled={isOwned || !canBuy}
                >
                  {isOwned ? 'Kjøpt' : canBuy ? 'Kjøp figur' : 'Ikke nok poeng'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );

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
      case 'shop':
        return renderShop();
      case 'topics':
        return (
          <div className={styles.page}>
            <h1>Emnevalg</h1>
            <p>Bruk listen til venstre for å velge et spesifikt tema.</p>
            <p>Du har valgt: <strong>Ingenting ennå</strong></p>
          </div>
        );
      case 'math_play':
        return renderMathGame();
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
          <div className={`${styles.stat} ${styles.outfitStat}`}>
            <span className={styles.label}>Antrekk:</span>
            <span className={styles.outfitValue}>
              {activeOutfit && <img src={activeOutfit.image} alt={activeOutfit.name} className={styles.headerOutfitImage} />}
              <span className={styles.value}>{user.unlockedOutfit}</span>
            </span>
          </div>
        </div>
        <button type="button" className={styles.shopBtn} onClick={() => onSetView('shop')}><Wand2 /> Til Capybara-Butikken</button>
      </header>

      {/* Dynamic Content */}
      <div className={styles.contentArea}>
        {renderContent()}
      </div>
    </main>
  );
};