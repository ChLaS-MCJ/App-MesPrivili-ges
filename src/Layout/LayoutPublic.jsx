import { Outlet } from 'react-router-dom';


const LayoutPublic = () => {
    return (
        <div className="layout">

            <main className="main-content">
                <Outlet />
            </main>

        </div>
    );
};

export default LayoutPublic;
