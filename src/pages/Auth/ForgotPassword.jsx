import { useState } from 'react';
import {
    IonContent,
    IonPage,
    IonInput,
    IonButton,
    IonToast,
    IonLoading,
    IonIcon,
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', color: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setToast({
                show: true,
                message: 'Veuillez entrer votre email',
                color: 'danger',
            });
            return;
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setToast({
                show: true,
                message: 'Email invalide',
                color: 'danger',
            });
            return;
        }

        setLoading(true);

        try {
            // TODO: Appeler l'API pour envoyer l'email de réinitialisation
            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setToast({
                    show: true,
                    message: 'Un email de réinitialisation vous a été envoyé',
                    color: 'success',
                });

                // Retour au login après 2 secondes
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setToast({
                    show: true,
                    message: data.message || 'Erreur lors de l\'envoi de l\'email',
                    color: 'danger',
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Erreur de connexion au serveur',
                color: 'danger',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <IonPage>
            <IonContent className="forgot-password-screen">
                <div className="forgot-password-container">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        <IonIcon icon={arrowBack} />
                    </button>

                    <div className="forgot-password-header">
                        <h1 className="forgot-password-title">Mot de passe</h1>
                        <h1 className="forgot-password-title">oublié ?</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="forgot-password-form">
                        <p className="forgot-password-description">
                            Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                        </p>

                        <div className="input-group">
                            <IonInput
                                className="forgot-password-input"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onIonChange={(e) => setEmail(e.detail.value)}
                            />
                        </div>

                        <IonButton
                            expand="block"
                            type="submit"
                            className="forgot-password-button"
                            disabled={loading}
                        >
                            Envoyer
                        </IonButton>
                    </form>

                    <div className="back-to-login-group">
                        <span className="back-to-login-text">Vous vous souvenez ? </span>
                        <button className="back-to-login-link" onClick={() => navigate('/login')}>
                            Se connecter
                        </button>
                    </div>
                </div>

                <IonLoading isOpen={loading} message="Envoi en cours..." />

                <IonToast
                    isOpen={toast.show}
                    message={toast.message}
                    duration={3000}
                    color={toast.color}
                    onDidDismiss={() => setToast({ ...toast, show: false })}
                />
            </IonContent>
        </IonPage>
    );
};

export default ForgotPassword;