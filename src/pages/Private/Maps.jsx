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

        <div className="maps-container">
            <h1>🗺️ Carte Interactive</h1>

        </div>

    );
};

export default Maps;