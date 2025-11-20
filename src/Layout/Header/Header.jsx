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
                        {/* Définition du dégradé */}
                        <defs>
                            <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ada59a" />
                                <stop offset="50%" stopColor="#bbb1a7" />
                                <stop offset="100%" stopColor="#c6b3af" />
                            </linearGradient>
                            {/* Filtre pour l'ombre */}
                            <filter id="headerShadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15" />
                            </filter>
                        </defs>

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