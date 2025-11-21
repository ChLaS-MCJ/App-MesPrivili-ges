import { useState } from 'react';
import {
    IonContent,
    IonPage,
    IonInput,
    IonButton,
    IonCheckbox,
    IonToast,
    IonLoading,
    IonIcon,
} from '@ionic/react';
import { logoGoogle, logoApple } from 'ionicons/icons';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../Utils/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', color: '' });

    const { login, loginWithGoogle, loginWithApple } = useAuth();
    const navigate = useNavigate();

    // Détecter si on est sur iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setToast({
                show: true,
                message: 'Veuillez remplir tous les champs',
                color: 'danger',
            });
            return;
        }

        setLoading(true);
        const result = await login(email, password, rememberMe);
        setLoading(false);

        if (result.success) {
            setToast({
                show: true,
                message: 'Connexion réussie !',
                color: 'success',
            });

            setTimeout(() => {
                navigate('/auth/maps');
            }, 500);
        } else {
            setToast({
                show: true,
                message: result.message || 'Erreur de connexion',
                color: 'danger',
            });
        }
    };

    // 🔥 VRAIE INTÉGRATION GOOGLE OAUTH
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);

            try {
                // Récupérer les infos de l'utilisateur depuis Google
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });

                const userInfo = await userInfoResponse.json();

                console.log('Google User Info:', userInfo);

                // Envoyer les données au backend
                const result = await loginWithGoogle({
                    googleId: userInfo.sub,
                    email: userInfo.email,
                    prenom: userInfo.given_name,
                    nom: userInfo.family_name,
                });

                if (result.success) {
                    setToast({
                        show: true,
                        message: 'Connexion Google réussie !',
                        color: 'success',
                    });

                    setTimeout(() => {
                        navigate('/auth/maps');
                    }, 500);
                } else {
                    setToast({
                        show: true,
                        message: result.message || 'Erreur de connexion Google',
                        color: 'danger',
                    });
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des infos Google:', error);
                setToast({
                    show: true,
                    message: 'Erreur de connexion Google',
                    color: 'danger',
                });
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            console.error('Erreur Google Login');
            setToast({
                show: true,
                message: 'Échec de la connexion Google',
                color: 'danger',
            });
        },
    });

    const handleAppleLogin = async () => {
        setLoading(true);

        try {
            // TODO: Intégrer Apple Sign In
            // Pour l'instant, simulation
            const appleData = {
                appleId: `apple-${Date.now()}`,
                email: 'test.apple@icloud.com'
            };

            const result = await loginWithApple(appleData);

            if (result.success) {
                setToast({
                    show: true,
                    message: 'Connexion Apple réussie !',
                    color: 'success',
                });

                setTimeout(() => {
                    navigate('/auth/maps');
                }, 500);
            } else {
                setToast({
                    show: true,
                    message: result.message || 'Erreur de connexion Apple',
                    color: 'danger',
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Erreur de connexion Apple',
                color: 'danger',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <IonPage>
            <IonContent className="login-screen">
                <div className="login-container">
                    <div className="login-header">
                        <h1 className="login-title">Connectez-vous</h1>
                        <h1 className="login-title">à votre compte</h1>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <IonInput
                                className="login-input"
                                type="email"
                                placeholder="Nom d'utilisateur/Email"
                                value={email}
                                onIonChange={(e) => setEmail(e.detail.value)}
                            />
                        </div>

                        <div className="input-group">
                            <IonInput
                                className="login-input"
                                type="password"
                                placeholder="Mot de passe"
                                value={password}
                                onIonChange={(e) => setPassword(e.detail.value)}
                            />
                            <button
                                type="button"
                                className="forgot-link"
                                onClick={() => navigate('/forgot-password')}
                            >
                                Oublié?
                            </button>
                        </div>

                        <div className="remember-group">
                            <IonCheckbox
                                checked={rememberMe}
                                onIonChange={(e) => setRememberMe(e.detail.checked)}
                                className="remember-checkbox"
                            />
                            <label className="remember-label">Se souvenir de moi</label>
                        </div>

                        <IonButton
                            expand="block"
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            Connexion
                        </IonButton>

                        {/* 🔥 BOUTON GOOGLE AVEC VRAIE INTÉGRATION */}
                        <IonButton
                            expand="block"
                            fill="outline"
                            className="google-button"
                            onClick={() => handleGoogleLogin()}
                            disabled={loading}
                        >
                            <IonIcon icon={logoGoogle} slot="start" />
                            Connexion avec Google
                        </IonButton>

                        {isIOS && (
                            <IonButton
                                expand="block"
                                fill="outline"
                                className="apple-button"
                                onClick={handleAppleLogin}
                                disabled={loading}
                            >
                                <IonIcon icon={logoApple} slot="start" />
                                Connexion avec Apple
                            </IonButton>
                        )}
                    </form>

                    <div className="signup-group">
                        <span className="signup-text">Vous n'avez pas de compte ? </span>
                        <button
                            className="signup-link"
                            onClick={() => navigate('/register')}
                        >
                            S'inscrire
                        </button>
                    </div>
                </div>

                <IonLoading isOpen={loading} message="Connexion en cours..." />

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

export default Login;