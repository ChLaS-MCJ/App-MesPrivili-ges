import { useRoutes } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import LayoutAuth from '../Layout/LayoutAuth';

const PrivateRouter = () => {
    return (
        <IonRouterOutlet>
            {useRoutes([
                {
                    path: '/',
                    element: <LayoutAuth />,
                    children: [

                    ],
                },
            ])}
        </IonRouterOutlet>
    );
};

export default PrivateRouter;
