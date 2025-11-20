import { Routes, Route, Navigate } from 'react-router-dom';
import LayoutPublic from '../Layout/LayoutPublic';
import Home from '../pages/Public/Home';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<LayoutPublic />}>
                <Route path="accueil" element={<Home />} />
                <Route index element={<Navigate to="/accueil" replace />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;
