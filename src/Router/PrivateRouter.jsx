import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../Utils/AuthContext';
import LayoutPublic from '../Layout/LayoutPublic';
import LayoutAuth from './../Layout/LayoutAuth';

// Pages Client
import Maps from '../pages/Private/Maps';
import Categories from '../pages/Private/Categories';
import Prestataires from '../pages/Private/Prestataires';
import FichePrestataire from '../pages/Private/FichePrestataire';
import AccountSettings from '../pages/Private/AccountSettings';
import History from '../pages/Private/History';

//Legals
import LegalMentions from '../pages/Private/Legals/LegalMentions';
import TermsOfService from '../pages/Private/Legals/TermsOfService';
import TermsOfSale from '../pages/Private/Legals/TermsOfSale';
import PrivacyPolicy from '../pages/Private/Legals/PrivacyPolicy';
// Pages Prestataire
import MonCommerce from '../pages/Private/MonCommerce';
import MesPromotions from '../pages/Private/MesPromotions';
import MesStatistiques from '../pages/Private/MesStatistiques';

import Favoris from '../pages/Private/Favoris';

// Pages Abonnement
import Abonnement from '../pages/Private/Abonnement';
import AbonnementSuccess from '../pages/Private/AbonnementSuccess';
import GestionAbonnement from '../pages/Private/GestionAbonnement';

// Page de test système (Admin)
import SystemTest from '../pages/Admin/SystemTest';

const PrivateRouter = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return null;
    }

    // Si pas authentifié, rediriger vers login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Routes>
            {/* Routes avec Header et Footer */}
            <Route path="/" element={<LayoutPublic />}>
                <Route path="maps" element={<Maps />} />
                <Route path="categories" element={<Categories />} />
                <Route path="prestataires" element={<Prestataires />} />
                <Route index element={<Navigate to="maps" replace />} />
            </Route>

            {/* Routes avec Header seulement (pas de footer) */}
            <Route path="/" element={<LayoutAuth />}>
                <Route path="account-settings" element={<AccountSettings />} />
                <Route path="history" element={<History />} />
                <Route path="legal-mentions" element={<LegalMentions />} />
                <Route path="terms-of-service" element={<TermsOfService />} />

                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="terms-of-sale" element={<TermsOfSale />} />

                <Route path="prestataire/:id" element={<FichePrestataire />} />

                {/* Routes Prestataire */}
                <Route path="mon-commerce" element={<MonCommerce />} />
                <Route path="mes-promotions" element={<MesPromotions />} />
                <Route path="mes-statistiques" element={<MesStatistiques />} />
                <Route path="favoris" element={<Favoris />} />

                {/* Routes Abonnement */}
                <Route path="abonnement" element={<Abonnement />} />
                <Route path="abonnement/success" element={<AbonnementSuccess />} />
                <Route path="gestion-abonnement" element={<GestionAbonnement />} />

                {/* Route Admin - Test Système */}
                <Route path="admin/system-test" element={<SystemTest />} />
            </Route>

        </Routes>
    );
};

export default PrivateRouter;