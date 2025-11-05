import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Plus, Minus, History, Settings, Search, Filter } from "lucide-react";
import { NotifService } from "../../services/NotifService";
import { Stock, MouvementStock } from "../../types/stock";
import { StockService } from "../../services/StockService";
import { Column } from "../../types/Columns";
import DataTableLayout from "../../layout/DataTableLayout";

export default function StockPage() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [selectedArticle, setSelectedArticle] = useState<{id: number, nom_artc: string} | null>(null);
    const [historique, setHistorique] = useState<MouvementStock[]>([]);
    const [showHistorique, setShowHistorique] = useState(false);
    const [historiqueLoading, setHistoriqueLoading] = useState(false);
    
    const [filters, setFilters] = useState({
        article: '',
        quantite_min: '',
        quantite_max: '',
        alerte: '',
    });

    const [showFilters, setShowFilters] = useState(false);

    const fetchStocks = async () => {
        try {
            setLoading(true);
            const data = await StockService.getStocks();
            console.log('Données brutes reçues:', data);
            
            let adaptedData: Stock[] = [];
            
            if (Array.isArray(data)) {
                adaptedData = data.map(item => ({
                    ...item,

                    article: {
                        id_article: item.id_article,
                        code_artc: item.code_artc || '',
                        nom_artc: item.nom_artc || ''
                    }
                }));
            } else if (data && typeof data === 'object') {
                if (Array.isArray(data.data)) {
                    adaptedData = data.data.map((item: any) => ({
                        ...item,
                        article: {
                            id_article: item.id_article,
                            code_artc: item.code_artc || '',
                            nom_artc: item.nom_artc || ''
                        }
                    }));
                } else if (Array.isArray(data.stocks)) {
                    adaptedData = data.stocks.map((item: any) => ({
                        ...item,
                        article: {
                            id_article: item.id_article,
                            code_artc: item.code_artc || '',
                            nom_artc: item.nom_artc || ''
                        }
                    }));
                } else {
                    adaptedData = [{
                        ...data,
                        article: {
                            id_article: data.id_article,
                            code_artc: data.code_artc || '',
                            nom_artc: data.nom_artc || ''
                        }
                    }];
                }
            }
            console.log('Stocks récupérés:', adaptedData);
            setStocks(adaptedData);
            setError(null);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Impossible de charger les stocks.";
            setError(errorMessage);
            console.error('Erreur fetchStocks:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStocks();
    }, []);

    const handleMouvement = async (id_article: number, articleDesignation: string, type: "ENTREE" | "SORTIE") => {
        const quantiteInput = prompt(`Quantité à ${type === "ENTREE" ? "ajouter" : "retirer"} pour ${articleDesignation} :`);
        const quantite = parseInt(quantiteInput || "0");
        
        if (isNaN(quantite) || quantite <= 0) {
            return alert("Quantité invalide. Veuillez entrer un nombre positif.");
        }

        try {
            const result = await StockService.addMouvement({
                id_article,
                quantite,
                type_mouvement: type,
                source: 'MANUEL'
            });

            await NotifService.createNotif({
                titre: "Mouvement de stock",
                body: `${type === "ENTREE" ? "Entrée" : "Sortie"} de ${quantite} unités pour ${articleDesignation}`,
                visibility: 3,
            });

            alert(result.message || "✅ Mouvement enregistré avec succès !");
            fetchStocks();
        } catch (err: any) {
            console.error('Erreur handleMouvement:', err);
            const errorMessage = err.response?.data?.message || "Erreur lors du mouvement de stock.";
            alert(errorMessage);
        }
    };

    const handleUpdateSeuil = async (stock: Stock) => {

        const articleName = stock.article?.nom_artc || stock.article?.code_artc || 'Article';
        const nouveauSeuilInput = prompt(
            `Nouveau seuil minimal pour ${articleName} :`,
            stock.seuil_min.toString()
        );
        const nouveauSeuil = parseInt(nouveauSeuilInput || "0");
        
        if (isNaN(nouveauSeuil) || nouveauSeuil < 0) {
            return alert("Seuil invalide. Veuillez entrer un nombre positif.");
        }

        try {
            await StockService.updateSeuil(stock.id_stock, nouveauSeuil);
            alert(" Seuil mis à jour avec succès !");
            fetchStocks();
        } catch (err: any) {
            console.error('Erreur handleUpdateSeuil:', err);
            const errorMessage = err.response?.data?.message || "Erreur lors de la mise à jour du seuil.";
            alert(errorMessage);
        }
    };

    const viewHistorique = async (id_article: number, articleNom: string) => {
        try {
            setHistoriqueLoading(true);
            setSelectedArticle({ id: id_article, nom_artc: articleNom });
            const data = await StockService.getHistorique(id_article);
            
            let adaptedHistorique: MouvementStock[] = [];
            
            if (Array.isArray(data)) {
                adaptedHistorique = data;
            } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
                adaptedHistorique = data.data;
            }
            
            setHistorique(adaptedHistorique);
            setShowHistorique(true);
        } catch (err: any) {
            console.error('Erreur viewHistorique:', err);
            alert('Erreur lors du chargement de l\'historique.');
        } finally {
            setHistoriqueLoading(false);
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const clearFilters = () => {
        setFilters({
            article: '',
            quantite_min: '',
            quantite_max: '',
            alerte: '',
        });
    };

    const filteredStock = stocks.filter((stock) => {
        const articleCode = stock.article?.code_artc?.toLowerCase() || '';
        const articleDesignation = stock.article?.nom_artc?.toLowerCase() || '';
        const searchTerm = filters.article.toLowerCase();
        
        return (
            (!filters.article || 
             articleCode.includes(searchTerm) || 
             articleDesignation.includes(searchTerm)) &&
            (!filters.quantite_min || stock.quantite_disponible >= parseInt(filters.quantite_min)) &&
            (!filters.quantite_max || stock.quantite_disponible <= parseInt(filters.quantite_max)) &&
            (!filters.alerte || 
                (filters.alerte === 'alerte' && stock.quantite_disponible <= stock.seuil_min) ||
                (filters.alerte === 'normal' && stock.quantite_disponible > stock.seuil_min))
        );
    });

    const getStockStatus = (stock: Stock) => {
        if (stock.quantite_disponible === 0) {
            return { text: "❌ Rupture", color: "text-red-600" };
        } else if (stock.quantite_disponible <= stock.seuil_min) {
            return { text: "⚠️ Stock Bas", color: "text-orange-600" };
        } else {
            return { text: "✅ Normal", color: "text-green-600" };
        }
    };

    const getStats = () => {
        return {
            total: stocks.length,
            normaux: stocks.filter(s => s.quantite_disponible > s.seuil_min).length,
            bas: stocks.filter(s => s.quantite_disponible <= s.seuil_min && s.quantite_disponible > 0).length,
            ruptures: stocks.filter(s => s.quantite_disponible === 0).length
        };
    };

    const stats = getStats();

    const columns: Column<Stock>[] = [
        { 
            name: "Code Article", 
            selector: (row) => row.article?.code_artc || "—",
            sortable: true 
        },
        { 
            name: "Nom de l'article", 
            selector: (row) => row.article?.nom_artc || "—",
            sortable: true 
        },
        { 
            name: "Quantité Disponible", 
            cell: (row) => (
                <span className={`font-semibold ${
                    row.quantite_disponible <= row.seuil_min ? 'text-red-600' : 'text-green-600'
                }`}>
                    {row.quantite_disponible}
                </span>
            ),
            sortable: true 
        },
        { 
            name: "Seuil Minimal", 
            selector: (row) => row.seuil_min,
            sortable: true 
        },
        {
            name: "État", 
            cell: (row) => {
                const status = getStockStatus(row);
                return <span className={`font-medium ${status.color}`}>{status.text}</span>;
            }
        },
        {
            name: "Actions", 
            cell: (row) => {
                const articleDesignation = row.article?.nom_artc || row.article?.code_artc || 'Article';
                return (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleMouvement(row.id_article, articleDesignation, "ENTREE")}
                            className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                            title="Entrée de stock"
                        >
                            <Plus className="w-4 h-4" /> Entrée
                        </button>
                        <button
                            onClick={() => handleMouvement(row.id_article, articleDesignation, "SORTIE")}
                            disabled={row.quantite_disponible === 0}
                            className={`flex items-center gap-1 px-3 py-2 text-sm text-white rounded-lg transition-colors ${
                                row.quantite_disponible === 0 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-red-500 hover:bg-red-600'
                            }`}
                            title={row.quantite_disponible === 0 ? "Stock épuisé" : "Sortie de stock"}
                        >
                            <Minus className="w-4 h-4" /> Sortie
                        </button>
                        <button
                            onClick={() => viewHistorique(row.id_article, articleDesignation)}
                            className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                            title="Voir l'historique"
                        >
                            <History className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleUpdateSeuil(row)}
                            className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition-colors"
                            title="Modifier le seuil"
                        >
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>
                );
            }
        }
    ];

    if (loading) return (
        <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg">Chargement des stocks...</span>
        </div>
    );

    if (error) return (
        <div className="text-center p-8">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
                onClick={fetchStocks}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Réessayer
            </button>
        </div>
    );

    return (
        <div>
            <PageMeta title="Gestion des Stocks" description="Suivi des stocks et alertes de seuil" />
            <PageBreadcrumb pageTitle="Gestion des Stocks" />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestion des Stocks</h1>
                    <p className="text-gray-600">Suivi en temps réel des niveaux de stock</p>
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <Filter className="w-4 h-4" />
                    Filtres
                </button>
            </div>

            {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                            <Search className="w-4 h-4 inline mr-1" />
                            Rechercher article
                        </label>
                        <input
                            type="text"
                            name="article"
                            value={filters.article}
                            onChange={handleFilterChange}
                            placeholder="Code ou nom de l'article..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Quantité min</label>
                        <input
                            type="number"
                            name="quantite_min"
                            value={filters.quantite_min}
                            onChange={handleFilterChange}
                            placeholder="Min"
                            min="0"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Quantité max</label>
                        <input
                            type="number"
                            name="quantite_max"
                            value={filters.quantite_max}
                            onChange={handleFilterChange}
                            placeholder="Max"
                            min="0"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex flex-col justify-end">
                        <label className="block text-sm font-medium mb-2 text-gray-700">État du stock</label>
                        <select
                            name="alerte"
                            value={filters.alerte}
                            onChange={handleFilterChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Tous les stocks</option>
                            <option value="alerte">Stock bas/rupture</option>
                            <option value="normal">Stock normal</option>
                        </select>
                    </div>
                    <div className="md:col-span-5 flex justify-end gap-2 pt-2">
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Effacer
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                    <div className="text-sm text-gray-600">Articles en stock</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-2xl font-bold text-green-600">{stats.normaux}</div>
                    <div className="text-sm text-gray-600">Stocks normaux</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-2xl font-bold text-orange-600">{stats.bas}</div>
                    <div className="text-sm text-gray-600">Stocks bas</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-2xl font-bold text-red-600">{stats.ruptures}</div>
                    <div className="text-sm text-gray-600">Ruptures</div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <DataTableLayout
                    title={`Liste des Stocks ${filteredStock.length !== stats.total ? `(${filteredStock.length}/${stats.total})` : `(${stats.total})`}`}
                    columns={columns}
                    data={filteredStock}
                    loading={loading}
                    error={error}
                />
            </div>

            {showHistorique && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">
                                Historique des mouvements - {selectedArticle?.nom_artc}
                            </h3>
                            <button
                                onClick={() => setShowHistorique(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        
                        {historiqueLoading ? (
                            <div className="flex justify-center items-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-3">Chargement de l'historique...</span>
                            </div>
                        ) : historique.length === 0 ? (
                            <div className="text-center p-8 text-gray-500">
                                Aucun mouvement enregistré pour cet article.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {historique.map((mouvement) => (
                                    <div key={mouvement.id_mouvement_stock} className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${
                                                    mouvement.type_mouvement === 'ENTREE' ? 'bg-green-500' : 'bg-red-500'
                                                }`}></div>
                                                <div>
                                                    <span className={`font-semibold ${
                                                        mouvement.type_mouvement === 'ENTREE' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        {mouvement.type_mouvement === 'ENTREE' ? 'Entrée' : 'Sortie'} de {mouvement.quantite} unité{mouvement.quantite > 1 ? 's' : ''}
                                                    </span>
                                                    {mouvement.source && (
                                                        <p className="text-sm text-gray-600 mt-1">Source: {mouvement.source}</p>
                                                    )}
                                                    {mouvement.reference_doc && (
                                                        <p className="text-sm text-gray-600">Référence: {mouvement.reference_doc}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-500 whitespace-nowrap">
                                                {new Date(mouvement.created_at).toLocaleString('fr-FR')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setShowHistorique(false)}
                                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}