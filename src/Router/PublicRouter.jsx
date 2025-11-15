import { Navigate, useRoutes } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import LayoutPublic from '../Layout/LayoutPublic';
import Home from '../pages/Public/Home';

const AppRouter = () => {
    return (
        <IonRouterOutlet>
            {useRoutes([
                {
                    path: '/',
                    element: <LayoutPublic />,
                    children: [
                        { path: 'accueil', element: <Home /> },
                        { path: '/', element: <Navigate to="/accueil" /> },
                    ],
                },
            ])}
        </IonRouterOutlet>
    );
};

export default AppRouter;
