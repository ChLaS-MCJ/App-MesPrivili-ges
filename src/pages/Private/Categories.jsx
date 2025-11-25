import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import PrestataireService from '../../Services/Prestataire.services';

// Import des images
import modeImg from '../../Assets/Images/Categories/mode.jpeg';
import restaurantsImg from '../../Assets/Images/Categories/restaurants.jpeg';
import hotelsImg from '../../Assets/Images/Categories/hotels.png';
import beauteImg from '../../Assets/Images/Categories/beaute.png';
import voyageImg from '../../Assets/Images/Categories/voyage.jpg';
import sportImg from '../../Assets/Images/Categories/sport.jpeg';
import techImg from '../../Assets/Images/Categories/tech.jpg';
import enfantsImg from '../../Assets/Images/Categories/enfants.png';
import maisonImg from '../../Assets/Images/Categories/maison.png';
import loisirImg from '../../Assets/Images/Categories/loisir.png';

const Categories = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const ville = searchParams.get('ville');
    const contentRef = useRef(null);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLeaving, setIsLeaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await PrestataireService.getByVille(ville);

                if (result.success) {
                    const prestataires = result.data.prestataires || [];
                    const categoriesMap = {};

                    prestataires.forEach(p => {
                        if (p.category && !categoriesMap[p.category.id]) {
                            categoriesMap[p.category.id] = {
                                ...p.category,
                                count: 0
                            };
                        }
                        if (p.category) {
                            categoriesMap[p.category.id].count++;
                        }
                    });

                    setCategories(Object.values(categoriesMap));
                }
            } catch (error) {
                console.error('Erreur chargement catégories:', error);
            } finally {
                setLoading(false);
            }
        };

        if (ville) {
            fetchCategories();
        }
    }, [ville]);

    useEffect(() => {
        const content = contentRef.current;
        if (!content) return;

        const handleScroll = () => {
            setIsScrolled(content.scrollTop > 0);
        };

        content.addEventListener('scroll', handleScroll);
        return () => content.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return categories;

        const query = searchQuery.toLowerCase().trim();

        return categories.filter(cat => {
            const nomMatch = cat.nom?.toLowerCase().includes(query);
            const motsMatch = cat.motsCles?.toLowerCase().includes(query);
            const descMatch = cat.description?.toLowerCase().includes(query);
            return nomMatch || motsMatch || descMatch;
        });
    }, [categories, searchQuery]);

    const handleBack = () => {
        setIsLeaving(true);
        setTimeout(() => {
            navigate('/auth/maps');
        }, 350);
    };

    const handleCategoryClick = (category) => {
        navigate(`/auth/prestataires?ville=${encodeURIComponent(ville)}&categoryId=${category.id}`);
    };

    const getDefaultImage = (categoryName) => {
        const images = {
            'Mode': modeImg,
            'Restaurants': restaurantsImg,
            'Hôtels': hotelsImg,
            'Beauté & Spa': beauteImg,
            'Voyage': voyageImg,
            'Sport & Fitness': sportImg,
            'High-Tech': techImg,
            'Enfants': enfantsImg,
            'Maison': maisonImg,
            'Loisir': loisirImg,
        };
        return images[categoryName] || modeImg;
    };

    const getCardSize = (index) => {
        const pattern = [
            'tall',
            'normal',
            'normal',
            'tall',
            'normal',
            'tall',
        ];
        return pattern[index % pattern.length];
    };

    return (
        <div className={`categories-page ${isLeaving ? 'page-leave' : ''}`}>
            {/* Header */}
            <div className="categories-header">
                <button className="back-button-category" onClick={handleBack}>
                    <ArrowLeftOutlined />
                </button>
                <h1>{ville}</h1>
                <div className="header-spacer"></div>
            </div>

            {/* Barre de recherche */}
            <div className="search-container">
                <div className="search-bar">
                    <SearchOutlined className="search-icon" />
                    <input
                        type="text"
                        placeholder="Rechercher une catégorie..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Séparateur */}
            <div className={`separator-line ${isScrolled ? 'scrolled' : ''}`}></div>

            {/* Contenu */}
            <div className="categories-content" ref={contentRef}>
                {loading ? (
                    <div className="categories-loading">
                        <div className="loader-spinner" />
                        <p>Chargement...</p>
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="categories-empty">
                        {searchQuery ? (
                            <p>Aucun résultat pour "{searchQuery}"</p>
                        ) : (
                            <p>Aucune catégorie disponible dans cette ville</p>
                        )}
                    </div>
                ) : (
                    <div className="categories-masonry">
                        <div className="masonry-column">
                            {filteredCategories.filter((_, i) => i % 2 === 0).map((category, index) => (
                                <div
                                    key={category.id}
                                    className={`category-card ${getCardSize(index * 2)}`}
                                    onClick={() => handleCategoryClick(category)}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div
                                        className="category-image"
                                        style={{
                                            backgroundImage: `url(${getDefaultImage(category.nom)})`
                                        }}
                                    />
                                    <div className="category-overlay" />
                                    <div className="category-info">
                                        <h3>{category.nom}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="masonry-column">
                            {filteredCategories.filter((_, i) => i % 2 === 1).map((category, index) => (
                                <div
                                    key={category.id}
                                    className={`category-card ${getCardSize(index * 2 + 1)}`}
                                    onClick={() => handleCategoryClick(category)}
                                    style={{ animationDelay: `${(index + 0.5) * 0.1}s` }}
                                >
                                    <div
                                        className="category-image"
                                        style={{
                                            backgroundImage: `url(${getDefaultImage(category.nom)})`
                                        }}
                                    />
                                    <div className="category-overlay" />
                                    <div className="category-info">
                                        <h3>{category.nom}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;