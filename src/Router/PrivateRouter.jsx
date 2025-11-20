import { Routes, Route } from 'react-router-dom';
import LayoutAuth from '../Layout/LayoutAuth';

const PrivateRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<LayoutAuth />}>
                {/* Ajoutez vos routes privées ici */}
            </Route>
        </Routes>
    );
};

export default PrivateRouter;