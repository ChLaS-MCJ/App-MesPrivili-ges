import { Routes, Route, Navigate } from 'react-router-dom';
import Maps from '../pages/Private/Maps';
import { useAuth } from '../Utils/AuthContext';
import LayoutPublic from '../Layout/LayoutPublic';

const PrivateRouter = () => {
    const { isAuthenticated, loading } = useAuth();

    // Si loading, ne rien afficher
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
                <Route index element={<Navigate to="maps" replace />} />
            </Route>
        </Routes>
    );
};

export default PrivateRouter;