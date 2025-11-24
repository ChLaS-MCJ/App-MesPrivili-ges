import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../Utils/AuthContext';
import LayoutPublic from '../Layout/LayoutPublic';
import LayoutAuth from './../Layout/LayoutAuth';
import Maps from '../pages/Private/Maps';
import Categories from '../pages/Private/Categories';
import AccountSettings from '../pages/Private/AccountSettings';
import History from '../pages/Private/History';
import LegalMentions from '../pages/Private/LegalMentions';
import TermsOfService from '../pages/Private/TermsOfService';



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
            <Route path="/" element={<LayoutPublic />}>
                <Route path="maps" element={<Maps />} />
                <Route path="categories" element={<Categories />} />
                <Route index element={<Navigate to="maps" replace />} />
            </Route>
            <Route path="/" element={<LayoutAuth />}>
                <Route path="account-settings" element={<AccountSettings />} />
                <Route path="history" element={<History />} />
                <Route path="legal-mentions" element={<LegalMentions />} />
                <Route path="terms-of-service" element={<TermsOfService />} />
            </Route>

        </Routes>



    );
};

export default PrivateRouter;