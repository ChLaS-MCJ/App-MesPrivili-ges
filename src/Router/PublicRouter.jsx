import { Routes, Route, Navigate } from 'react-router-dom';
import LayoutPublic from '../Layout/LayoutPublic';
import Home from '../pages/Public/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import { useAuth } from '../Utils/AuthContext';

const PublicRouter = () => {
    const { isAuthenticated, loading } = useAuth();

    // Si loading, ne rien afficher (le loader global gère ça)
    if (loading) {
        return null;
    }

    // Si authentifié, rediriger vers la zone privée
    if (isAuthenticated) {
        return <Navigate to="/auth/maps" replace />;
    }

    return (
        <Routes>
            <Route path="/" element={<LayoutPublic />}>
                <Route path="accueil" element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route index element={<Navigate to="/login" replace />} />
            </Route>
        </Routes>
    );
};

export default PublicRouter;