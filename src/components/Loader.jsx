import React, { useEffect, useState } from 'react';


const ModernLoader = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            // Commence l'animation de fade-out
            setFadeOut(true);

            // Attend la fin de l'animation avant de cacher complètement
            setTimeout(() => {
                setIsVisible(false);
                if (onFinish) onFinish();
            }, 500); // Durée de l'animation fade-out
        }, 2500); // Commence à disparaître après 2.5s

        return () => clearTimeout(timer);
    }, [onFinish]);

    if (!isVisible) return null;

    return (
        <div className={`modern-loader ${fadeOut ? 'fade-out' : ''}`}>
            {/* Main content */}
            <div className="loader-content">
                {/* 3 dots animés - style mobile */}
                <div className="loader-dots">
                    <div className="loader-dot"></div>
                    <div className="loader-dot"></div>
                    <div className="loader-dot"></div>
                </div>

                {/* Titre */}
                <h1 className="loader-title">Mes Privilèges</h1>

                {/* Tagline */}
                <p className="loader-tagline">Chargement...</p>
            </div>
        </div>
    );
};

export default ModernLoader;