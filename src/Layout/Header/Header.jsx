import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Utils/AuthContext';
import losangeIcon from '../../Assets/Images/rhombe.png';
import profilimg from '../../Assets/Images/profilimg.jpeg';
import {
    BellOutlined,
    CloseOutlined,
    UserOutlined,
    HistoryOutlined,
    LogoutOutlined,
    FileTextOutlined,
    SafetyOutlined
} from '@ant-design/icons';

const Header = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };

    // Navigation vers les différentes pages
    const handleNavigation = (path) => {
        closeDrawer();
        navigate(path);
    };

    // Déconnexion
    const handleLogout = async () => {
        try {
            await logout();
            closeDrawer();
            navigate('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    // Déterminer si l'utilisateur peut modifier son mot de passe
    const canChangePassword = user?.authProvider === 'local' || !user?.authProvider;

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
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.15" />
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

                            <linearGradient id="topShine" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </defs>

                        {/* Groupe avec clip-path pour contenir tous les effets dans le path */}
                        <g clipPath="url(#pathClip)">
                            {/* Forme principale */}
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

                            {/* Overlay sombre */}
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

                            {/* Spot lumineux animé */}
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
                                    values="0.3; 0.5; 0.3"
                                    dur="4s"
                                    repeatCount="indefinite"
                                />
                            </ellipse>

                            {/* Bande lumineuse en haut */}
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
                        </g>
                    </svg>
                </div>

                {/* Icône cloche notification */}
                <div className="notification-bell">
                    <BellOutlined style={{ fontSize: '20px', color: 'white' }} />
                    <div className="bell-dot"></div>
                </div>

                {/* Cercle de profil - CLIQUABLE */}
                <div className="profile-container" onClick={toggleDrawer}>
                    <div className="profile-circle">
                        <img
                            src={user?.profileImage || profilimg}
                            alt="Profile"
                            className="profile-image"
                        />

                        {/* Point de notification */}
                        <div className="notification-dot"></div>

                        {/* Badge losange */}
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
                    {/* Informations utilisateur */}
                    <div className="profile-info">
                        <img
                            src={user?.profileImage || profilimg}
                            alt="Profile"
                            className="drawer-profile-image"
                        />
                        <h3>
                            {user?.prenom && user?.nom
                                ? `${user.prenom} ${user.nom}`
                                : user?.client?.prenom && user?.client?.nom
                                    ? `${user.client.prenom} ${user.client.nom}`
                                    : 'Utilisateur'}
                        </h3>
                        <p>{user?.email || 'email@example.com'}</p>

                        {/* Badge du type de connexion */}
                        {user?.authProvider && (
                            <div className="auth-provider-badge">
                                {user.authProvider === 'google' && '🔵 Google'}
                                {user.authProvider === 'apple' && '🍎 Apple'}
                                {user.authProvider === 'local' && '🔐 Compte local'}
                            </div>
                        )}
                    </div>

                    {/* Menu principal */}
                    <div className="drawer-menu">
                        <button
                            className="drawer-menu-item"
                            onClick={() => handleNavigation('/account-settings')}
                        >
                            <UserOutlined className="menu-icon" />
                            <span>Mes informations</span>
                        </button>

                        <button
                            className="drawer-menu-item"
                            onClick={() => handleNavigation('/history')}
                        >
                            <HistoryOutlined className="menu-icon" />
                            <span>Historique</span>
                        </button>

                        <div className="drawer-divider"></div>

                        {/* Mentions légales & CGU */}
                        <button
                            className="drawer-menu-item secondary"
                            onClick={() => handleNavigation('/legal-mentions')}
                        >
                            <FileTextOutlined className="menu-icon" />
                            <span>Mentions légales</span>
                        </button>

                        <button
                            className="drawer-menu-item secondary"
                            onClick={() => handleNavigation('/terms-of-service')}
                        >
                            <SafetyOutlined className="menu-icon" />
                            <span>Conditions d'utilisation</span>
                        </button>

                        <div className="drawer-divider"></div>

                        {/* Déconnexion */}
                        <button
                            className="drawer-menu-item logout"
                            onClick={handleLogout}
                        >
                            <LogoutOutlined className="menu-icon" />
                            <span>Déconnexion</span>
                        </button>
                    </div>

                    {/* Footer avec version */}
                    <div className="drawer-footer">
                        <p>Version 1.0.0</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;