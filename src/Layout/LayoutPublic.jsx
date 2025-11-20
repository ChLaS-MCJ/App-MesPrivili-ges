import { Outlet } from 'react-router-dom';
import Header from '../Layout/Header/Header';
import Footer from '../Layout/Footer/Footer';

const LayoutPublic = () => {
    return (
        <div className="layout-public">
            <Header />

            <main className="main-content">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default LayoutPublic;




