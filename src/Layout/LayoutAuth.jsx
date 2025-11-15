import { Outlet } from 'react-router-dom';

const LayoutAuth = () => {
    return (
        <div className="layout">

            <main className="main-content">
                <Outlet />
            </main>

        </div>
    );
};

export default LayoutAuth;
