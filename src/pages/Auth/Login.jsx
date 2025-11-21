import { useState } from 'react';
import {
    IonContent,
    IonPage,
    IonInput,
    IonButton,
    IonCheckbox,
    IonToast,
    IonLoading,
} from '@ionic/react';
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

    const handleGoogleLogin = async () => {
        setToast({
            show: true,
            message: 'Connexion Google en cours...',
            color: 'primary',
        });
        // TODO: Intégrer Google OAuth
        console.log('Google login clicked');
    };

    const handleAppleLogin = async () => {
        setToast({
            show: true,
            message: 'Connexion Apple en cours...',
            color: 'primary',
        });
        // TODO: Intégrer Apple Sign In
        console.log('Apple login clicked');
    };

    return (
        <IonPage>
            <IonContent className="login-screen">
                <div className="login-container">
                    <div className="login-header">
                        <h1 className="login-title">Log into</h1>
                        <h1 className="login-title">your account</h1>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <IonInput
                                className="login-input"
                                type="email"
                                placeholder="Username/Email"
                                value={email}
                                onIonChange={(e) => setEmail(e.detail.value)}
                                clearInput
                            />
                        </div>

                        <div className="input-group">
                            <IonInput
                                className="login-input"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onIonChange={(e) => setPassword(e.detail.value)}
                            />
                            <button
                                type="button"
                                className="forgot-link"
                                onClick={() => navigate('/forgot-password')}
                            >
                                Forgot?
                            </button>
                        </div>

                        <div className="remember-group">
                            <IonCheckbox
                                checked={rememberMe}
                                onIonChange={(e) => setRememberMe(e.detail.checked)}
                                className="remember-checkbox"
                            />
                            <label className="remember-label">Remember me</label>
                        </div>

                        <IonButton
                            expand="block"
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            Log In
                        </IonButton>

                        <IonButton
                            expand="block"
                            fill="outline"
                            className="google-button"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            <ion-icon name="logo-google" slot="start"></ion-icon>
                            Log in with Google
                        </IonButton>

                        <IonButton
                            expand="block"
                            fill="outline"
                            className="apple-button"
                            onClick={handleAppleLogin}
                            disabled={loading}
                        >
                            <ion-icon name="logo-apple" slot="start"></ion-icon>
                            Log in with Apple
                        </IonButton>
                    </form>

                    <div className="signup-group">
                        <span className="signup-text">Don't have an account? </span>
                        <button
                            className="signup-link"
                            onClick={() => navigate('/register')}
                        >
                            Sign Up
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