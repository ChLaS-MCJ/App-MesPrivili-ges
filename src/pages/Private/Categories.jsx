import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const Categories = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const ville = searchParams.get('ville');

    return (
        <div className="categories-page">
            {/* Header */}
            <div className="categories-header">
                <button className="back-button" onClick={() => navigate('/maps')}>
                    <ArrowLeftOutlined />
                </button>
                <h1>{ville ? `Catégories à ${ville}` : 'Catégories'}</h1>
            </div>

            {/* Contenu */}
            <div className="categories-content">
                <div className="placeholder-content">
                    <p>🏪 Page catégories</p>
                    {ville && <p>Ville sélectionnée : <strong>{ville}</strong></p>}
                    <p>À développer...</p>
                </div>
            </div>
        </div>
    );
};

export default Categories;
