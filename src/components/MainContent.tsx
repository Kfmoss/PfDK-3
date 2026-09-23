// src/components/MainContent.tsx
import React, { useState } from 'react';
import styles from '../App.module.css';
import logo from '../assets/mat_capybara_logo.png'; // Husk å legge logoen her
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
  { id: 'fig1', name: 'Figur 1', price: 5000, image: fig1 },
  { id: 'fig2', name: 'Figur 2', price: 5800, image: fig2 },
  { id: 'fig3', name: 'Figur 3', price: 6600, image: fig3 },
  { id: 'fig4', name: 'Figur 4', price: 7400, image: fig4 },
  { id: 'fig5', name: 'Figur 5', price: 8200, image: fig5 },
  { id: 'fig6', name: 'Figur 6', price: 9000, image: fig6 },
  { id: 'fig7', name: 'Figur 7', price: 9600, image: fig7 },
  { id: 'fig9', name: 'Figur 9', price: 10000, image: fig9 },
];

export const MainContent: React.FC<MainContentProps> = ({ activeView, onSetView }) => {
  // Mock-tilstand for spill-elementer
  const [user, setUser] = useState<UserStatus>({
    points: 0,
    level: 1,
    unlockedOutfit: 'Klassisk Genser',
  });
  const [ownedItems, setOwnedItems] = useState<string[]>([]);

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
    setOwnedItems((currentItems) => [...currentItems, item.id]);
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
        <button type="button" className={styles.shopBtn} onClick={() => onSetView('shop')}><Wand2 /> Til Capybara-Butikken</button>
      </header>

      {/* Dynamic Content */}
      <div className={styles.contentArea}>
        {renderContent()}
      </div>
    </main>
  );
};