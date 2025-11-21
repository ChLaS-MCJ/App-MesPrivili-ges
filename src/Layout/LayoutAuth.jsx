import { Outlet } from 'react-router-dom';

const LayoutAuth = () => {
    return (
        <div className="layout-auth">
            <main className="auth-content">
                <Outlet />
            </main>
        </div>
    );
};

export default LayoutAuth;