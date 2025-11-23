import { Routes, Route, Navigate } from 'react-router-dom';
import LayoutPublic from '../Layout/LayoutPublic';
import LayoutAuth from '../Layout/LayoutAuth';
import Home from '../pages/Public/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import { useAuth } from '../Utils/AuthContext';

const PublicRouter = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (isAuthenticated) {
        return <Navigate to="/auth/maps" replace />;
    }

    return (
        <Routes>
            {/* Routes avec Header/Footer */}
            <Route path="/" element={<LayoutPublic />}>
                <Route path="accueil" element={<Home />} />
            </Route>

            {/* Routes SANS Header/Footer (Login/Register/ForgotPassword) */}
            <Route path="/" element={<LayoutAuth />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Redirection par défaut */}
            <Route index element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default PublicRouter;