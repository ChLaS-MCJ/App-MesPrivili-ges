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
import { arrowBack, logoGoogle, logoApple, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../Utils/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        prenom: '',
        nom: '',
        telephone: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', color: '' });

    const { register, loginWithGoogle, loginWithApple } = useAuth();
    const navigate = useNavigate();

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const validateForm = () => {
        if (!formData.email || !formData.password || !formData.prenom || !formData.nom) {
            setToast({
                show: true,
                message: 'Veuillez remplir tous les champs obligatoires',
                color: 'danger',
            });
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setToast({
                show: true,
                message: 'Les mots de passe ne correspondent pas',
                color: 'danger',
            });
            return false;
        }

        if (formData.password.length < 8) {
            setToast({
                show: true,
                message: 'Le mot de passe doit contenir au moins 8 caractères',
                color: 'danger',
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        const result = await register({
            ...formData,
            role: 'client',
        });

        setLoading(false);

        if (result.success) {
            setToast({
                show: true,
                message: 'Inscription réussie !',
                color: 'success',
            });

            setTimeout(() => {
                navigate('/auth/maps');
            }, 500);
        } else {
            setToast({
                show: true,
                message: result.message || 'Erreur lors de l\'inscription',
                color: 'danger',
            });
        }
    };

    const handleGoogleRegister = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);

            try {
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });

                const userInfo = await userInfoResponse.json();

                const result = await loginWithGoogle({
                    googleId: userInfo.sub,
                    email: userInfo.email,
                    prenom: userInfo.given_name,
                    nom: userInfo.family_name,
                });

                if (result.success) {
                    setToast({
                        show: true,
                        message: 'Inscription Google réussie !',
                        color: 'success',
                    });

                    setTimeout(() => {
                        navigate('/auth/maps');
                    }, 500);
                } else {
                    setToast({
                        show: true,
                        message: result.message || 'Erreur lors de l\'inscription Google',
                        color: 'danger',
                    });
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des infos Google:', error);
                setToast({
                    show: true,
                    message: 'Erreur lors de l\'inscription Google',
                    color: 'danger',
                });
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            console.error('Erreur Google Register');
            setToast({
                show: true,
                message: 'Échec de l\'inscription Google',
                color: 'danger',
            });
        },
    });

    const handleAppleRegister = async () => {
        setLoading(true);

        try {
            const appleData = {
                appleId: `apple-${Date.now()}`,
                email: 'test.apple@icloud.com'
            };

            const result = await loginWithApple(appleData);

            if (result.success) {
                setToast({
                    show: true,
                    message: 'Inscription Apple réussie !',
                    color: 'success',
                });

                setTimeout(() => {
                    navigate('/auth/maps');
                }, 500);
            } else {
                setToast({
                    show: true,
                    message: result.message || 'Erreur lors de l\'inscription Apple',
                    color: 'danger',
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Erreur lors de l\'inscription Apple',
                color: 'danger',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <IonPage>
            <IonContent className="register-screen">
                <div className="register-container">
                    <button className="back-button-register" onClick={() => navigate(-1)}>
                        <IonIcon icon={arrowBack} />
                    </button>

                    <div className="register-header">
                        <h1 className="register-title">Créer</h1>
                        <h1 className="register-title">votre compte</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form" autoComplete="off">
                        <div className="input-group">
                            <IonInput
                                className="register-input"
                                type="text"
                                placeholder="Prénom *"
                                value={formData.prenom}
                                onIonChange={(e) => handleChange('prenom', e.detail.value)}
                                autocomplete="given-name"
                                name="prenom"
                            />
                        </div>

                        <div className="input-group">
                            <IonInput
                                className="register-input"
                                type="text"
                                placeholder="Nom *"
                                value={formData.nom}
                                onIonChange={(e) => handleChange('nom', e.detail.value)}
                                autocomplete="family-name"
                                name="nom"
                            />
                        </div>

                        <div className="input-group">
                            <IonInput
                                className="register-input"
                                type="email"
                                placeholder="Email *"
                                value={formData.email}
                                onIonChange={(e) => handleChange('email', e.detail.value)}
                                autocomplete="email"
                                name="email"
                            />
                        </div>

                        <div className="input-group">
                            <IonInput
                                className="register-input"
                                type="tel"
                                placeholder="Téléphone"
                                value={formData.telephone}
                                onIonChange={(e) => handleChange('telephone', e.detail.value)}
                                autocomplete="tel"
                                name="telephone"
                            />
                        </div>

                        <div className="input-group input-password-group">
                            <IonInput
                                className="register-input"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Mot de passe *"
                                value={formData.password}
                                onIonChange={(e) => handleChange('password', e.detail.value)}
                                autocomplete="new-password"
                                name="password"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                            </button>
                        </div>

                        <div className="input-group input-password-group">
                            <IonInput
                                className="register-input"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirmer le mot de passe *"
                                value={formData.confirmPassword}
                                onIonChange={(e) => handleChange('confirmPassword', e.detail.value)}
                                autocomplete="new-password"
                                name="confirmPassword"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <IonIcon icon={showConfirmPassword ? eyeOffOutline : eyeOutline} />
                            </button>
                        </div>

                        <p className="required-text">* Champs obligatoires</p>

                        <IonButton
                            expand="block"
                            type="submit"
                            className="register-button"
                            disabled={loading}
                        >
                            S'inscrire
                        </IonButton>

                        <IonButton
                            expand="block"
                            fill="outline"
                            className="google-button"
                            onClick={() => handleGoogleRegister()}
                            disabled={loading}
                        >
                            <IonIcon icon={logoGoogle} slot="start" />
                            S'inscrire avec Google
                        </IonButton>

                        {isIOS && (
                            <IonButton
                                expand="block"
                                fill="outline"
                                className="apple-button"
                                onClick={handleAppleRegister}
                                disabled={loading}
                            >
                                <IonIcon icon={logoApple} slot="start" />
                                S'inscrire avec Apple
                            </IonButton>
                        )}
                    </form>

                    <div className="login-group">
                        <span className="login-text">Vous avez déjà un compte ? </span>
                        <button className="login-link" onClick={() => navigate('/login')}>
                            Se connecter
                        </button>
                    </div>
                </div>

                <IonLoading isOpen={loading} message="Création du compte..." />

                <IonToast
                    isOpen={toast.show}
                    message={toast.message}
                    duration={3000}
                    color={toast.color}
                    cssClass={`toast-${toast.color}`}
                    onDidDismiss={() => setToast({ ...toast, show: false })}
                />
            </IonContent>
        </IonPage>
    );
};

export default Register;