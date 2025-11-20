import { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { gridOutline, mapOutline, sunnyOutline, moonOutline } from 'ionicons/icons';

const Footer = () => {
    const [activeTab, setActiveTab] = useState('map');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [screenWidth, setScreenWidth] = useState(375);

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

    // Calcul des positions proportionnelles
    const width = screenWidth;
    const ratio = width / 375;

    // Positions des ondulations adaptées
    const leftWave = {
        start: 35.5 * ratio,
        q1x: 49.5 * ratio, q1y: 32,
        q2x: 53.5 * ratio, q2y: 40,
        q3x: 65.5 * ratio, q3y: 56,
        center: 80 * ratio, centerY: 56,
        q4x: 94.5 * ratio, q4y: 56,
        q5x: 106.5 * ratio, q5y: 40,
        q6x: 110.5 * ratio, q6y: 32,
        end: 124.5 * ratio
    };

    const centerWave = {
        start: 143 * ratio,
        q1x: 157 * ratio, q1y: 32,
        q2x: 161 * ratio, q2y: 40,
        q3x: 173 * ratio, q3y: 56,
        center: 187.5 * ratio, centerY: 56,
        q4x: 202 * ratio, q4y: 56,
        q5x: 214 * ratio, q5y: 40,
        q6x: 218 * ratio, q6y: 32,
        end: 232 * ratio
    };

    const rightWave = {
        start: 249.5 * ratio,
        q1x: 263.5 * ratio, q1y: 32,
        q2x: 267.5 * ratio, q2y: 40,
        q3x: 279.5 * ratio, q3y: 56,
        center: 294 * ratio, centerY: 56,
        q4x: 308.5 * ratio, q4y: 56,
        q5x: 320.5 * ratio, q5y: 40,
        q6x: 324.5 * ratio, q6y: 32,
        end: 338.5 * ratio
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

                    {/* Filtre pour l'ombre */}
                    <filter id="footerShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="-4" stdDeviation="8" floodOpacity="0.15" />
                    </filter>
                </defs>

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
            </svg>

            {/* Boutons dans les trous */}
            <div className="footer-buttons">
                {/* Bouton Catégories (gauche) */}
                <button
                    className={`footer-btn footer-btn-left ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => setActiveTab('categories')}
                >
                    <div className="btn-circle">
                        <IonIcon icon={gridOutline} className="btn-icon" />
                    </div>
                    <span className="btn-label">Explorer</span>
                </button>

                {/* Bouton Map (centre) */}
                <button
                    className={`footer-btn footer-btn-center ${activeTab === 'map' ? 'active' : ''}`}
                    onClick={() => setActiveTab('map')}
                >
                    <div className="btn-circle">
                        <IonIcon icon={mapOutline} className="btn-icon" />
                    </div>
                    <span className="btn-label">Carte</span>
                </button>

                {/* Bouton Thème (droite) */}
                <button
                    className={`footer-btn footer-btn-right ${isDarkMode ? 'active' : ''}`}
                    onClick={handleThemeToggle}
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