import React from 'react';
import styles from '../App.module.css';
import popcorn1 from '../assets/popcorn1.png';
import popcorn2 from '../assets/popcorn2.png';
import popcorn3 from '../assets/popcorn3.png';

interface CelebrationOverlayProps {
	fullScreen?: boolean;
}

const popcornImages = [popcorn1, popcorn2, popcorn3];
const confettiColors = ['#e76f51', '#2a9d8f', '#e9c46a', '#457b9d', '#8ab17d', '#f4a261'];

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ fullScreen = false }) => {
	const popcornCount = fullScreen ? 12 : popcornImages.length;
	const confettiCount = fullScreen ? 48 : 8;

	return (
		<div
			className={`${styles.assessmentCelebration} ${fullScreen ? styles.assessmentCelebrationFullScreen : ''}`}
			aria-hidden="true"
		>
			{Array.from({ length: popcornCount }, (_, index) => (
				<img
					src={popcornImages[index % popcornImages.length]}
					alt=""
					className={`${styles.assessmentPopcorn} ${fullScreen ? styles.assessmentPopcornFullscreen : styles[`assessmentPopcorn${['One', 'Two', 'Three'][index]}`]}`}
					style={fullScreen ? {
						left: `${(index * 37 + 8) % 92}%`,
						top: `${(index * 53 + 6) % 86}%`,
						animationDelay: `${(index % 6) * 0.11}s`,
					} : undefined}
					key={index}
				/>
			))}
			{Array.from({ length: confettiCount }, (_, index) => (
				<span
					className={`${styles.assessmentConfettiPiece} ${fullScreen ? styles.assessmentConfettiFullscreen : ''}`}
					style={fullScreen ? {
						left: `${(index * 47 + 5) % 98}%`,
						top: `${-((index * 29) % 100)}%`,
						backgroundColor: confettiColors[index % confettiColors.length],
						animationDelay: `${(index % 16) * 0.07}s`,
					} : undefined}
					key={index}
				/>
			))}
		</div>
	);
};