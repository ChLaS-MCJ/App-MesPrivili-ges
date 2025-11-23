import { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { gridOutline, mapOutline, qrCodeOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import QRCodeModal from '../../components/QRCodeModal';

const Footer = () => {
    const [activeTab, setActiveTab] = useState('map');
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    const navigate = useNavigate();

    useEffect(() => {
        const updateWidth = () => {
            setScreenWidth(window.innerWidth);
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);

        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const handleQRClick = () => {
        setIsQRModalOpen(true);
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    const width = screenWidth;
    const waveSpacing = width / 3;
    const waveWidth = 90;
    const waveDepth = 24;

    // Ondulation gauche
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

    // Ondulation centre
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

    // Ondulation droite
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
        <>
            <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />

            <footer className="app-footer">
                <svg className="footer-wave" viewBox={`0 0 ${width} 90`} preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#1f1f1f', stopOpacity: 1 }} />
                            <stop offset="50%" style={{ stopColor: '#1f1f1f', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#1f1f1f', stopOpacity: 1 }} />
                        </linearGradient>

                        <radialGradient id="footerLightSpot" cx="50%" cy="50%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </radialGradient>

                        <linearGradient id="footerBottomShine" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>

                        <filter id="footerShadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="-4" stdDeviation="8" floodOpacity="0.15" />
                        </filter>

                        <filter id="footerGlow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Vague principale avec effets lumineux */}
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
                       L${width},32 L${width},90 L0,90 Z`}
                        fill="url(#footerGradient)"
                        filter="url(#footerShadow)"
                    />


                    {/* Bande lumineuse en bas */}
                    <rect
                        x="0"
                        y="60"
                        width={width}
                        height="30"
                        fill="url(#footerBottomShine)"
                    >
                        <animate
                            attributeName="opacity"
                            values="0.20; 0.3; 0.20"
                            dur="3s"
                            repeatCount="indefinite"
                        />
                    </rect>
                </svg>

                <div className="footer-buttons">
                    <button
                        className={`footer-btn ${activeTab === 'categories' ? 'active' : ''}`}
                        onClick={() => setActiveTab('categories')}
                        style={{ left: `${leftWaveCenter}px`, transform: 'translateX(-50%)' }}
                    >
                        <div className="btn-circle">
                            <IonIcon icon={gridOutline} className="btn-icon" />
                        </div>
                        <span className="btn-label">Explorer</span>
                    </button>

                    <button
                        className={`footer-btn ${activeTab === 'map' ? 'active' : ''}`}
                        onClick={() => handleNavigation('/auth/maps')}
                        style={{ left: `${centerWaveCenter}px`, transform: 'translateX(-50%)' }}
                    >
                        <div className="btn-circle">
                            <IonIcon icon={mapOutline} className="btn-icon" />
                        </div>
                        <span className="btn-label">Carte</span>
                    </button>

                    <button
                        className={`footer-btn`}
                        onClick={handleQRClick}
                        style={{ left: `${rightWaveCenter}px`, transform: 'translateX(-50%)' }}
                    >
                        <div className="btn-circle">
                            <IonIcon icon={qrCodeOutline} className="btn-icon" />
                        </div>
                        <span className="btn-label">QR Code</span>
                    </button>
                </div>
            </footer>
        </>
    );
};

export default Footer;