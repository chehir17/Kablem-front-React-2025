import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    TooltipItem,
} from "chart.js";
import axios from "axios";
import { useApiDebounce } from "../../hooks/useApiDebounce";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ScrapZoneData {
    zone_affe_prob: string;
    qnt_scrap: number;
    nb_registres: number;
    pourcentage: number;
}

interface ApiResponse {
    scrapData: ScrapZoneData[];
    annee: string;
    totals: {
        total_scrap: number;
        total_registres: number;
        zones_count: number;
    };
}

const ScrapByZoneChart = () => {
    const [scrapData, setScrapData] = useState<ScrapZoneData[]>([]);
    const [annee, setAnnee] = useState<string>('');
    const [totals, setTotals] = useState({ total_scrap: 0, total_registres: 0, zones_count: 0 });
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { executeDebouncedApi, cancel } = useApiDebounce(500);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

    useEffect(() => {
        const fetchScrapData = async () => {
            await executeDebouncedApi(
                async () => {
                    try {
                        setLoading(true);
                        
                        const response = await axios.get<ApiResponse>(`http://localhost:8000/api/scrap/by-zone/${selectedYear}`);
                        
                        if (response.data && Array.isArray(response.data.scrapData)) {
                            setScrapData(response.data.scrapData);
                            setAnnee(response.data.annee);
                            setTotals(response.data.totals);
                        } else {
                            throw new Error('Format de données invalide');
                        }
                        
                    } catch (err: any) {
                        console.error(' Erreur:', err);
                        const errorMessage = err.response?.data?.message || err.message || 'Erreur inconnue';
                        setError(`Erreur: ${errorMessage}`);
                        setScrapData([]);
                    } finally {
                        setLoading(false);
                    }
                }
            );
        };

        fetchScrapData();

        return () => {
            cancel();
        };
    }, [selectedYear, executeDebouncedApi, cancel]);

    const labels = scrapData.map((item) => item.zone_affe_prob);
    const values = scrapData.map((item) => item.qnt_scrap);
    const percentages = scrapData.map((item) => item.pourcentage);

    const data = {
        labels,
        datasets: [
            {
                label: "Quantité de Scrap",
                data: values,
                backgroundColor: "rgba(54, 162, 235, 0.7)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    afterLabel: function(context: TooltipItem<'bar'>) {
                        const index = context.dataIndex;
                        if (index >= 0 && scrapData[index]) {
                            return `Pourcentage: ${percentages[index]}% | Registres: ${scrapData[index].nb_registres}`;
                        }
                        return '';
                    }
                }
            },
            title: {
                display: true,
                text: `SCRAP par zone affectée - ${selectedYear}`,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Quantité de Scrap",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Zone Affectée",
                },
            },
        },
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="h-64 bg-gray-300 rounded"></div>
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                    Chargement des données scrap {selectedYear}...
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <div className="card-title text-lg font-semibold text-gray-600 dark:text-gray-200">
                    SCRAP par zone affectée
                </div>
                
                <div className="flex items-center gap-3">
                    <label htmlFor="year-select-scrap" className="text-sm text-gray-600 dark:text-gray-400">
                        Année:
                    </label>
                    <select
                        id="year-select-scrap"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="px-3 py-1 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    >
                        {years.map(year => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            {scrapData.length === 0 && !loading && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-700 text-sm text-center">
                        Aucune donnée scrap trouvée pour {selectedYear}
                    </p>
                </div>
            )}
            
            {scrapData.length > 0 && (
                <>
                    <Bar data={data} options={options} />

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="text-sm text-blue-600 dark:text-blue-400">Total Scrap</div>
                            <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{totals.total_scrap}</div>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-sm text-green-600 dark:text-green-400">Registres</div>
                            <div className="text-lg font-bold text-green-700 dark:text-green-300">{totals.total_registres}</div>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="text-sm text-purple-600 dark:text-purple-400">Zones</div>
                            <div className="text-lg font-bold text-purple-700 dark:text-purple-300">{totals.zones_count}</div>
                        </div>
                    </div>

                    {scrapData.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Top 3 des zones les plus problématiques:
                            </h4>
                            <div className="space-y-1">
                                {scrapData.slice(0, 3).map((zone, index) => (
                                    <div key={zone.zone_affe_prob} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {index + 1}. {zone.zone_affe_prob}
                                        </span>
                                        <span className="font-medium text-red-600 dark:text-red-400">
                                            {zone.qnt_scrap} scrap ({zone.pourcentage}%)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ScrapByZoneChart;