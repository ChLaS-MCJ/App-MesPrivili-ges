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
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', color: '' });

    const { register } = useAuth();
    const navigate = useNavigate();

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

    return (
        <IonPage>
            <IonContent className="register-screen">
                <div className="register-container">
                    <button className="back-button" onClick={() => navigate(-1)}>
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

                        <div className="input-group">
                            <IonInput
                                className="register-input"
                                type="password"
                                placeholder="Mot de passe *"
                                value={formData.password}
                                onIonChange={(e) => handleChange('password', e.detail.value)}
                                autocomplete="new-password"
                                name="password"
                            />
                        </div>

                        <div className="input-group">
                            <IonInput
                                className="register-input"
                                type="password"
                                placeholder="Confirmer le mot de passe *"
                                value={formData.confirmPassword}
                                onIonChange={(e) => handleChange('confirmPassword', e.detail.value)}
                                autocomplete="new-password"
                                name="confirmPassword"
                            />
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