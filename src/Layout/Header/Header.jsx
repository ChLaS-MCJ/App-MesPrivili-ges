import { useState } from 'react';
import losangeIcon from '../../Assets/Images/rhombe.png';
import profilimg from '../../Assets/Images/profilimg.jpeg';
import { BellOutlined, CloseOutlined } from '@ant-design/icons';

const Header = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <>
            <header className="app-header">
                {/* Vague SVG avec dégradé */}
                <div className="wave-container">
                    <svg
                        className="wave-svg"
                        viewBox="0 0 1200 150"
                        preserveAspectRatio="xMidYMid slice">
                        <defs>
                            {/* Gradient principal avec animation de couleurs */}
                            <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#595554ff">
                                    <animate
                                        attributeName="stop-color"
                                        values="#2b2929ff; #4b4746ff; #403c3bff"
                                        dur="6s"
                                        repeatCount="indefinite"
                                    />
                                </stop>
                                <stop offset="50%" stopColor="#2e2c2aff">
                                    <animate
                                        attributeName="stop-color"
                                        values="#3a3a39ff; #524d48ff; #3f3e3cff"
                                        dur="6s"
                                        repeatCount="indefinite"
                                    />
                                </stop>
                                <stop offset="100%" stopColor="#535150ff">
                                    <animate
                                        attributeName="stop-color"
                                        values="#8a7f76; #9a8f86; #8a7f76"
                                        dur="6s"
                                        repeatCount="indefinite"
                                    />
                                </stop>
                            </linearGradient>

                            {/* Spot lumineux radial */}
                            <radialGradient id="lightSpot" cx="30%" cy="40%">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />  /* Réduit de 0.7 à 0.4 */
                                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.15" /> /* Réduit de 0.3 à 0.15 */
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                            </radialGradient>

                            {/* Ombre portée */}
                            <filter id="headerShadow">
                                <feDropShadow dx="0" dy="8" stdDeviation="18" floodColor="#000000" floodOpacity="0.25" />
                            </filter>

                            {/* Effet glow */}
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            {/* Masque pour limiter les effets au path */}
                            <clipPath id="pathClip">
                                <path
                                    d="M0,0 L0,100 L545,100 
                                       Q568,100 572,92
                                       Q586,75 600,75 
                                       Q617,75 630,92 
                                       Q635,101 662,100 
                                       L1200,100 L1200,0 Z"
                                />
                            </clipPath>
                        </defs>

                        {/* Groupe avec clip-path pour contenir tous les effets dans le path */}
                        <g clipPath="url(#pathClip)">
                            {/* Forme principale - VOTRE ONDULATION ORIGINALE */}
                            <path
                                d="M0,0 L0,100 L545,100 
                                   Q568,100 572,92
                                   Q586,75 600,75 
                                   Q617,75 630,92 
                                   Q635,101 662,100 
                                   L1200,100 L1200,0 Z"
                                fill="url(#headerGradient)"
                                filter="url(#headerShadow)"
                            />

                            {/* Overlay sombre sur tout le path */}
                            <path
                                d="M0,0 L0,100 L545,100 
                                   Q568,100 572,92
                                   Q586,75 600,75 
                                   Q617,75 630,92 
                                   Q635,101 662,100 
                                   L1200,100 L1200,0 Z"
                                fill="#424040ff"
                                opacity="0.40"
                            />

                            {/* Premier spot lumineux - gauche à droite (discret) */}
                            <ellipse
                                cx="280"
                                cy="50"
                                rx="350"
                                ry="85"
                                fill="url(#lightSpot)"
                                filter="url(#glow)"
                            >
                                <animate
                                    attributeName="cx"
                                    values="280; 450; 650; 450; 280"
                                    dur="12s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="opacity"
                                    values="0.3; 0.5; 0.3"  /* Réduit de 0.5-0.8 à 0.3-0.5 */
                                    dur="4s"
                                    repeatCount="indefinite"
                                />
                            </ellipse>


                            {/* Bande lumineuse en haut du path */}
                            <rect
                                x="0"
                                y="0"
                                width="1200"
                                height="30"
                                fill="url(#topShine)"
                            >
                                <animate
                                    attributeName="opacity"
                                    values="0.3; 0.6; 0.3"
                                    dur="3s"
                                    repeatCount="indefinite"
                                />
                            </rect>

                            <linearGradient id="topShine" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </g>
                    </svg>
                </div>

                {/* Icône cloche notification en haut à droite */}
                <div className="notification-bell">
                    <BellOutlined style={{ fontSize: '20px', color: 'white' }} />
                    <div className="bell-dot"></div>
                </div>

                {/* Cercle de profil - CLIQUABLE */}
                <div className="profile-container" onClick={toggleDrawer}>
                    <div className="profile-circle">
                        <img
                            src={profilimg}
                            alt="Profile"
                            className="profile-image"
                        />

                        {/* Point de notification */}
                        <div className="notification-dot"></div>

                        {/* Badge losange avec image */}
                        <div className="badge-container">
                            <img src={losangeIcon} alt="Losange" className="losange-icon" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Overlay (fond sombre) */}
            {isDrawerOpen && (
                <div className="drawer-overlay" onClick={toggleDrawer}></div>
            )}

            {/* Drawer du profil */}
            <div className={`profile-drawer ${isDrawerOpen ? 'open' : ''}`}>
                {/* Bouton de fermeture */}
                <button className="drawer-close-btn" onClick={toggleDrawer}>
                    <CloseOutlined />
                </button>

                <div className="drawer-content">
                    <div className="profile-info">
                        <img src={profilimg} alt="Profile" className="drawer-profile-image" />
                        <h3>Nom d'utilisateur</h3>
                        <p>email@example.com</p>
                    </div>

                    <div className="drawer-menu">
                        <button className="drawer-menu-item">Mes informations</button>
                        <button className="drawer-menu-item">Historique</button>
                        <button className="drawer-menu-item logout">Déconnexion</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;