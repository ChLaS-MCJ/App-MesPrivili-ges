import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import '../Assets/Css/Login.css';

const Login = () => {
    const history = useHistory();

    const handleLogin = () => {
        // Logique de connexion ici
        history.push('/home');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Connexion</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <div className="login-container">
                    <h1>Bienvenue</h1>
                    <IonInput label="Email" type="email" placeholder="email@example.com" />
                    <IonInput label="Mot de passe" type="password" placeholder="••••••••" />
                    <IonButton expand="block" onClick={handleLogin}>
                        Se connecter
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;