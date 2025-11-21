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

                </div>
            </IonContent>
        </IonPage>
    );
};

export default Maps;