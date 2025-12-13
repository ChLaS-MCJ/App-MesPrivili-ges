import { useState, useEffect } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import './AnimatedSplash.css';

import logo from '../../Assets/Images/LogoMP.png';

const AnimatedSplash = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        SplashScreen.hide().catch(() => { });

        const timer = setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
                setIsVisible(false);
                if (onFinish) onFinish();
            }, 600);
        }, 4000);

        return () => clearTimeout(timer);
    }, [onFinish]);

    if (!isVisible) return null;

    return (
        <div className={`animated-splash ${isFadingOut ? 'fade-out' : ''}`}>
            {/* Aurora Borealis Effect */}
            <div className="aurora-container">
                <div className="aurora aurora-1"></div>
                <div className="aurora aurora-2"></div>
                <div className="aurora aurora-3"></div>
                <div className="aurora aurora-4"></div>
            </div>

            <div className="splash-content">
                <div className="splash-ring"></div>
                <div className="splash-ring splash-ring-2"></div>
                <img src={logo} alt="Logo" className="splash-logo" />
            </div>
        </div>
    );
};

export default AnimatedSplash;