import { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { gridOutline, mapOutline, sunnyOutline, moonOutline } from 'ionicons/icons';

const Footer = () => {
    const [activeTab, setActiveTab] = useState('map');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const updateWidth = () => {
            setScreenWidth(window.innerWidth);
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);

        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const handleThemeToggle = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark-mode');
    };

    // Calcul des positions proportionnelles basées sur la largeur réelle
    const width = screenWidth;

    // Calcul dynamique des 3 ondulations espacées uniformément
    const waveSpacing = width / 3; // Divise l'écran en 3 parties égales

    // DIMENSIONS FIXES pour éviter la déformation
    const waveWidth = 90; // Largeur fixe de l'ondulation
    const waveDepth = 24; // Profondeur fixe de l'ondulation

    // Ondulation gauche (centrée sur le premier tiers)
    const leftWaveCenter = waveSpacing * 0.5;
    const leftWave = {
        start: leftWaveCenter - waveWidth / 2,
        q1x: leftWaveCenter - (waveWidth * 0.4), q1y: 32,
        q2x: leftWaveCenter - (waveWidth * 0.35), q2y: 32 + 8,
        q3x: leftWaveCenter - (waveWidth * 0.15), q3y: 32 + waveDepth,
        center: leftWaveCenter, centerY: 32 + waveDepth,
        q4x: leftWaveCenter + (waveWidth * 0.15), q4y: 32 + waveDepth,
        q5x: leftWaveCenter + (waveWidth * 0.35), q5y: 32 + 8,
        q6x: leftWaveCenter + (waveWidth * 0.4), q6y: 32,
        end: leftWaveCenter + waveWidth / 2
    };

    // Ondulation centre (centrée sur le deuxième tiers)
    const centerWaveCenter = waveSpacing * 1.5;
    const centerWave = {
        start: centerWaveCenter - waveWidth / 2,
        q1x: centerWaveCenter - (waveWidth * 0.4), q1y: 32,
        q2x: centerWaveCenter - (waveWidth * 0.35), q2y: 32 + 8,
        q3x: centerWaveCenter - (waveWidth * 0.15), q3y: 32 + waveDepth,
        center: centerWaveCenter, centerY: 32 + waveDepth,
        q4x: centerWaveCenter + (waveWidth * 0.15), q4y: 32 + waveDepth,
        q5x: centerWaveCenter + (waveWidth * 0.35), q5y: 32 + 8,
        q6x: centerWaveCenter + (waveWidth * 0.4), q6y: 32,
        end: centerWaveCenter + waveWidth / 2
    };

    // Ondulation droite (centrée sur le troisième tiers)
    const rightWaveCenter = waveSpacing * 2.5;
    const rightWave = {
        start: rightWaveCenter - waveWidth / 2,
        q1x: rightWaveCenter - (waveWidth * 0.4), q1y: 32,
        q2x: rightWaveCenter - (waveWidth * 0.35), q2y: 32 + 8,
        q3x: rightWaveCenter - (waveWidth * 0.15), q3y: 32 + waveDepth,
        center: rightWaveCenter, centerY: 32 + waveDepth,
        q4x: rightWaveCenter + (waveWidth * 0.15), q4y: 32 + waveDepth,
        q5x: rightWaveCenter + (waveWidth * 0.35), q5y: 32 + 8,
        q6x: rightWaveCenter + (waveWidth * 0.4), q6y: 32,
        end: rightWaveCenter + waveWidth / 2
    };

    return (
        <footer className="app-footer">
            {/* SVG Wave dynamique */}
            <svg className="footer-wave" viewBox={`0 0 ${width} 90`} preserveAspectRatio="none">
                <defs>
                    {/* Dégradé beige/marron */}
                    <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#1f1f1f', stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: '#1f1f1f', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#1f1f1f', stopOpacity: 1 }} />
                    </linearGradient>

                    {/* Spot lumineux radial - TRÈS DISCRET */}
                    <radialGradient id="footerLightSpot" cx="50%" cy="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </radialGradient>

                    {/* Filtre pour l'ombre */}
                    <filter id="footerShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="-4" stdDeviation="8" floodOpacity="0.15" />
                    </filter>

                    {/* Effet glow léger */}
                    <filter id="footerGlow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Masque pour limiter les effets au path */}
                    <clipPath id="footerClip">
                        <path
                            d={`M0,90 L0,32 
                               L${leftWave.start},32
                               Q${leftWave.q1x},${leftWave.q1y} ${leftWave.q2x},${leftWave.q2y}
                               Q${leftWave.q3x},${leftWave.q3y} ${leftWave.center},${leftWave.centerY}
                               Q${leftWave.q4x},${leftWave.q4y} ${leftWave.q5x},${leftWave.q5y}
                               Q${leftWave.q6x},${leftWave.q6y} ${leftWave.end},32
                               L${centerWave.start},32
                               Q${centerWave.q1x},${centerWave.q1y} ${centerWave.q2x},${centerWave.q2y}
                               Q${centerWave.q3x},${centerWave.q3y} ${centerWave.center},${centerWave.centerY}
                               Q${centerWave.q4x},${centerWave.q4y} ${centerWave.q5x},${centerWave.q5y}
                               Q${centerWave.q6x},${centerWave.q6y} ${centerWave.end},32
                               L${rightWave.start},32
                               Q${rightWave.q1x},${rightWave.q1y} ${rightWave.q2x},${rightWave.q2y}
                               Q${rightWave.q3x},${rightWave.q3y} ${rightWave.center},${rightWave.centerY}
                               Q${rightWave.q4x},${rightWave.q4y} ${rightWave.q5x},${rightWave.q5y}
                               Q${rightWave.q6x},${rightWave.q6y} ${rightWave.end},32
                               L${width},32 L${width},90 Z`}
                        />
                    </clipPath>
                </defs>

                {/* Groupe avec clip-path pour contenir tous les effets */}
                <g clipPath="url(#footerClip)">
                    {/* Vague avec 3 ondulations adaptées dynamiquement */}
                    <path
                        d={`M0,90 L0,32 
                           L${leftWave.start},32
                           Q${leftWave.q1x},${leftWave.q1y} ${leftWave.q2x},${leftWave.q2y}
                           Q${leftWave.q3x},${leftWave.q3y} ${leftWave.center},${leftWave.centerY}
                           Q${leftWave.q4x},${leftWave.q4y} ${leftWave.q5x},${leftWave.q5y}
                           Q${leftWave.q6x},${leftWave.q6y} ${leftWave.end},32
                           L${centerWave.start},32
                           Q${centerWave.q1x},${centerWave.q1y} ${centerWave.q2x},${centerWave.q2y}
                           Q${centerWave.q3x},${centerWave.q3y} ${centerWave.center},${centerWave.centerY}
                           Q${centerWave.q4x},${centerWave.q4y} ${centerWave.q5x},${centerWave.q5y}
                           Q${centerWave.q6x},${centerWave.q6y} ${centerWave.end},32
                           L${rightWave.start},32
                           Q${rightWave.q1x},${rightWave.q1y} ${rightWave.q2x},${rightWave.q2y}
                           Q${rightWave.q3x},${rightWave.q3y} ${rightWave.center},${rightWave.centerY}
                           Q${rightWave.q4x},${rightWave.q4y} ${rightWave.q5x},${rightWave.q5y}
                           Q${rightWave.q6x},${rightWave.q6y} ${rightWave.end},32
                           L${width},32 L${width},90 Z`}
                        fill="url(#footerGradient)"
                        filter="url(#footerShadow)"
                    />

                    {/* Spot lumineux qui se déplace en vague - TRÈS LÉGER */}
                    <ellipse
                        cx={width * 0.3}
                        cy="60"
                        rx={width * 0.4}
                        ry="40"
                        fill="url(#footerLightSpot)"
                        filter="url(#footerGlow)"
                    >
                        <animate
                            attributeName="cx"
                            values={`${width * 0.3}; ${width * 0.5}; ${width * 0.7}; ${width * 0.5}; ${width * 0.3}`}
                            dur="12s"
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="opacity"
                            values="0.2; 0.4; 0.2"
                            dur="4s"
                            repeatCount="indefinite"
                        />
                    </ellipse>

                    {/* Bande lumineuse en bas - TRÈS SUBTILE */}
                    <rect
                        x="0"
                        y="60"
                        width={width}
                        height="20"
                        fill="url(#footerBottomShine)"
                    >
                        <animate
                            attributeName="opacity"
                            values="0.15; 0.3; 0.15"
                            dur="3s"
                            repeatCount="indefinite"
                        />
                    </rect>

                    <linearGradient id="footerBottomShine" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </g>
            </svg>

            {/* Boutons dans les trous - POSITIONS SYNCHRONISÉES */}
            <div className="footer-buttons">
                {/* Bouton Catégories (gauche) - positionné au centre de la première ondulation */}
                <button
                    className={`footer-btn footer-btn-left ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => setActiveTab('categories')}
                    style={{ left: `${leftWaveCenter}px`, transform: 'translateX(-50%)' }}
                >
                    <div className="btn-circle">
                        <IonIcon icon={gridOutline} className="btn-icon" />
                    </div>
                    <span className="btn-label">Explorer</span>
                </button>

                {/* Bouton Map (centre) - positionné au centre de la deuxième ondulation */}
                <button
                    className={`footer-btn footer-btn-center ${activeTab === 'map' ? 'active' : ''}`}
                    onClick={() => setActiveTab('map')}
                    style={{ left: `${centerWaveCenter}px`, transform: 'translateX(-50%)' }}
                >
                    <div className="btn-circle">
                        <IonIcon icon={mapOutline} className="btn-icon" />
                    </div>
                    <span className="btn-label">Carte</span>
                </button>

                {/* Bouton Thème (droite) - positionné au centre de la troisième ondulation */}
                <button
                    className={`footer-btn footer-btn-right ${isDarkMode ? 'active' : ''}`}
                    onClick={handleThemeToggle}
                    style={{ left: `${rightWaveCenter}px`, transform: 'translateX(-50%)' }}
                >
                    <div className="btn-circle">
                        <IonIcon icon={isDarkMode ? moonOutline : sunnyOutline} className="btn-icon" />
                    </div>
                    <span className="btn-label">Mode</span>
                </button>
            </div>
        </footer>
    );
};

export default Footer;