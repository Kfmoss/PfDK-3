// src/components/Sidebar.tsx
import React from 'react';
import { LayoutDashboard, Target, BookOpenText, BrainCircuit, Tv, FileQuestion } from 'lucide-react';
import styles from '../App.module.css';

interface SidebarProps {
  onSelectItem: (item: string) => void;
  activeItem: string;
}

// Emner fra VG1 1P-læreplanen
const themes = [
  { id: 'start', name: 'Startside', icon: LayoutDashboard },
  { id: 'mapping', name: 'Kartleggingstester', icon: Target },
  { id: 'math_play', name: 'Mattelek / Spill', icon: BrainCircuit },
  { id: 'videos', name: 'Videoer', icon: Tv },
  { id: 'exam', name: 'Eksamensoppgaver', icon: FileQuestion },
  { separator: true, name: 'TEMAOPPGAVER' },
  { id: 'numbers', name: 'Tall og algebra', icon: BookOpenText },
  { id: 'functions', name: 'Funksjoner & Modellering', icon: BookOpenText },
  { id: 'geometry', name: 'Geometri', icon: BookOpenText },
  { id: 'economics', name: 'Økonomi', icon: BookOpenText },
  { id: 'statistics', name: 'Statistikk', icon: BookOpenText },
  { separator: true, name: 'FAG' },
  { id: 'subject_1t', name: '1T', icon: BookOpenText },
  { id: 'subject_2t', name: '2T', icon: BookOpenText },
  { id: 'subject_1p', name: '1P', icon: BookOpenText },
  { id: 'subject_2p', name: '2P', icon: BookOpenText },
  { id: 'subject_s1', name: 'S1', icon: BookOpenText },
  { id: 'subject_s2', name: 'S2', icon: BookOpenText },
];

export const Sidebar: React.FC<SidebarProps> = ({ onSelectItem, activeItem }) => {
  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul>
          {/* {themes.map((item, index) => {
            if (item.separator) {
              return <li key={index} className={styles.separator}>{item.name}</li>;
            }
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button 
                  onClick={() => onSelectItem(item.id)}
                  className={activeItem === item.id ? styles.active : ''}
                >
                  {Icon && <Icon size={20} className={styles.icon} />}
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })} */}
          {themes.map((item, index) => {
  // 1. Sjekk om det er en separator først
            if ('separator' in item && item.separator) {
                return <li key={index} className={styles.separator}>{item.name}</li>;
            }

            // 2. Nå vet TypeScript 100% sikkert at item har en gyldig 'id'
            const Icon = item.icon;
            return (
                <li key={item.id}>
                <button 
                    onClick={() => item.id && onSelectItem(item.id)}
                    className={activeItem === item.id ? styles.active : ''}
                >
                    {Icon && <Icon size={20} className={styles.icon} />}
                    <span>{item.name}</span>
                </button>
                </li>
            );
            })}
        </ul>
      </nav>
    </aside>
  );
};