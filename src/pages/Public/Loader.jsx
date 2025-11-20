import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Loader = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirection vers login après 2 secondes
        const timer = setTimeout(() => {
            navigate('/login');
        }, 2000);

        return () => clearTimeout(timer);
    }, [history]);

    return (
        <IonPage>
            <IonContent className="loader-content">
                <div className="loader-container">
                    <IonSpinner name="crescent" className="loader-spinner" />
                    <h2>Chargement...</h2>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Loader;