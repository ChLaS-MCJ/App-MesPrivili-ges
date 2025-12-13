import React, { useEffect, useState, useRef } from 'react';


const ModernLoader = ({ onFinish, delayBeforeFade = 500 }) => {
    const [fadeOut, setFadeOut] = useState(false);
    const [shouldRender, setShouldRender] = useState(true);
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;

        const handleVideoEnd = () => {
            // Attend X millisecondes avant de lancer l'animation
            setTimeout(() => {
                setFadeOut(true);
            }, delayBeforeFade);
        };

        if (video) {
            video.addEventListener('ended', handleVideoEnd);
        }

        return () => {
            if (video) {
                video.removeEventListener('ended', handleVideoEnd);
            }
        };
    }, [delayBeforeFade]);

    const handleAnimationEnd = () => {
        if (fadeOut) {
            setShouldRender(false);
            if (onFinish) onFinish();
        }
    };

    if (!shouldRender) return null;

    return (
        <div
            className={`modern-loader ${fadeOut ? 'fade-out' : ''}`}
            onTransitionEnd={handleAnimationEnd}
        >
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="loader-video"
            >
                <source src="/assets/videos/logo-animation.mp4" type="video/mp4" />
            </video>
        </div>
    );
};

export default ModernLoader;