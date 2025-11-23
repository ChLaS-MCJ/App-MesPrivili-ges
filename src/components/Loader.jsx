import React, { useEffect, useState } from 'react';


const ModernLoader = ({ onFinish }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {

            setFadeOut(true);

            setTimeout(() => {
                setIsVisible(false);
                if (onFinish) onFinish();
            }, 500);
        }, 2500);

        return () => clearTimeout(timer);
    }, [onFinish]);

    if (!isVisible) return null;

    return (
        <div className={`modern-loader ${fadeOut ? 'fade-out' : ''}`}>

            <div className="loader-content">

                <div className="loader-dots">
                    <div className="loader-dot"></div>
                    <div className="loader-dot"></div>
                    <div className="loader-dot"></div>
                </div>


                <h1 className="loader-title">Mes Privilèges</h1>


                <p className="loader-tagline">Chargement...</p>
            </div>
        </div>
    );
};

export default ModernLoader;