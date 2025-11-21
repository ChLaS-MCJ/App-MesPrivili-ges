import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
} from '@ionic/react';
import { useAuth } from '../../Utils/AuthContext';


const Maps = () => {
    const { user, logout } = useAuth();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Maps - Mes Privilèges</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="maps-screen">
                <div className="maps-container">
                    <h1>🗺️ Carte Interactive</h1>
                    <p>Bienvenue {user?.email} !</p>

                    <div className="placeholder-map">
                        <p>📍 La carte interactive des commerces sera ici</p>
                        <p>Avec géolocalisation et catégories</p>
                    </div>

                    <IonButton expand="block" onClick={logout} color="danger">
                        Déconnexion
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Maps;