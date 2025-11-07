import { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { useApiDebounce } from "../../hooks/useApiDebounce";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DmppStatusData {
    mois: string;
    encours: number;
    termine: number;
}

interface ApiResponse {
    dmppData: DmppStatusData[];
    annee: string;
    totals: {
        encours: number;
        termine: number;
        total: number;
    };
}

export function DMPPOpenVsClosed() {
    const [dmppData, setDmppData] = useState<DmppStatusData[]>([]);
    const [annee, setAnnee] = useState<string>('');
    const [totals, setTotals] = useState({ encours: 0, termine: 0, total: 0 });
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { executeDebouncedApi, loading: apiLoading, cancel, error: apiError } = useApiDebounce(10000);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

    useEffect(() => {
        const fetchDmppData = async () => {
            await executeDebouncedApi(
                async () => {
                    try {
                        setLoading(true);
                        setError(null);

                        const response = await axios.get<ApiResponse>(`http://localhost:8000/api/dmpp/open-vs-closed/${selectedYear}`, {
                            timeout: 15000,
                        });
                        console.log('Réponse API reçue:', response.data);

                        if (response.data && Array.isArray(response.data.dmppData)) {
                            setDmppData(response.data.dmppData);
                            setAnnee(response.data.annee || selectedYear.toString());
                            setTotals(response.data.totals || { encours: 0, termine: 0, total: 0 });
                        } else {
                            throw new Error('Format de données invalide');
                        }

                    } catch (err: any) {
                        console.error('Erreur:', err);
                        const errorMessage = err.response?.data?.message || err.message || 'Erreur lors du chargement des données';
                        setError(`Erreur: ${errorMessage}`);

                        setDmppData([]);
                        setTotals({ encours: 0, termine: 0, total: 0 });
                    } finally {
                        setLoading(false);
                    }
                },
                {
                    onError: (err) => {

                        console.error('Erreur debounce:', err);
                        setError('Erreur lors du chargement des données');
                        setLoading(false);
                    },
                    retryDelay: 10000
                }
            );
        };

        fetchDmppData();

        return () => {
            cancel();
        };
    }, [selectedYear, executeDebouncedApi, cancel]);

    useEffect(() => {
        if (apiError) {
            console.log("Erreur API détectée DmppPer month:", apiError);
        }
    }, [apiError]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    usePointStyle: true,
                    padding: 15,
                }
            },
            title: {
                display: true,
                text: `DMPP : Ouvertes vs Clôturées - ${selectedYear}`,
                font: {
                    size: 16,
                    weight: 'bold' as const
                }
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 10,
                cornerRadius: 4
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Nombre de DMPP",
                    font: {
                        weight: 'bold' as const
                    }
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                }
            },
            x: {
                title: {
                    display: true,
                    text: "Mois",
                    font: {
                        weight: 'bold' as const
                    }
                },
                grid: {
                    display: false
                }
            },
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false
        }
    };

    const chartData = {
        labels: dmppData.length > 0 ? dmppData.map((d) => d.mois) : ['Aucune donnée'],
        datasets: [
            {
                label: "DMPP Ouvertes",
                data: dmppData.length > 0 ? dmppData.map((d) => d.encours) : [0],
                backgroundColor: "rgba(239, 68, 68, 0.7)",
                borderColor: "rgb(239, 68, 68)",
                borderWidth: 1,
                borderRadius: 4,
                barPercentage: 0.6,
            },
            {
                label: "DMPP Clôturées",
                data: dmppData.length > 0 ? dmppData.map((d) => d.termine) : [0],
                backgroundColor: "rgba(34, 197, 94, 0.7)",
                borderColor: "rgb(34, 197, 94)",
                borderWidth: 1,
                borderRadius: 4,
                barPercentage: 0.6,
            },
        ],
    };

    const isLoading = apiLoading || loading;

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="h-64 bg-gray-300 rounded"></div>
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                    Chargement des statistiques DMPP {selectedYear}...
                </p>
            </div>
        );
    }

    const hasData = dmppData.length > 0 && totals.total > 0;

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <div className="text-lg font-semibold text-gray-600 dark:text-gray-200">
                    DMPP : Ouvertes vs Clôturées
                </div>

                <div className="flex items-center gap-3">
                    <label htmlFor="year-select-open-closed" className="text-sm text-gray-600 dark:text-gray-400">
                        Année:
                    </label>
                    <select
                        id="year-select-open-closed"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 dark:bg-red-900/20 dark:border-red-800">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                    </div>
                </div>
            )}

            {!hasData && !error && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 dark:bg-yellow-900/20 dark:border-yellow-800">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                            Aucune donnée DMPP disponible pour {selectedYear}
                        </p>
                    </div>
                </div>
            )}

            <div className="h-80">
                {chartData && chartData.labels && chartData.labels.length > 0 ? (
                    <Bar data={chartData} options={options} />
                ) : (
                    <div className="h-64 flex items-center justify-center">
                        <p className="text-gray-500">Aucune donnée à afficher</p>
                    </div>
                )}
            </div>

            {hasData && (
                <>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                            <div className="text-sm font-medium text-red-600 dark:text-red-400">Ouvertes</div>
                            <div className="text-2xl font-bold text-red-700 dark:text-red-300">{totals.encours}</div>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                            <div className="text-sm font-medium text-green-600 dark:text-green-400">Clôturées</div>
                            <div className="text-2xl font-bold text-green-700 dark:text-green-300">{totals.termine}</div>
                        </div>
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                            <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Total</div>
                            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totals.total}</div>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Taux de clôture: {((totals.termine / totals.total) * 100).toFixed(1)}%
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}