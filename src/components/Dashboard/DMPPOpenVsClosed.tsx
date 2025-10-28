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
import { color } from "framer-motion";
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
    const [isDark,] = useState(false);
    const { executeDebouncedApi, cancel } = useApiDebounce(500);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

    useEffect(() => {
        const fetchDmppData = async () => {
            await executeDebouncedApi(
                async () => {
                    try {
                        setLoading(true);

                        const response = await axios.get<ApiResponse>(`http://localhost:8000/api/dmpp/open-vs-closed/${selectedYear}`);
                        console.log('Réponse API reçue:', response.data);

                        if (response.data && Array.isArray(response.data.dmppData)) {
                            setDmppData(response.data.dmppData);
                            setAnnee(response.data.annee);
                            setTotals(response.data.totals);
                        } else {
                            throw new Error('Format de données invalide');
                        }

                    } catch (err: any) {
                        console.error('Erreur:', err);
                        const errorMessage = err.response?.data?.message || err.message || 'Erreur inconnue';
                        setError(`Erreur: ${errorMessage}`);
                        setDmppData([]);
                    } finally {
                        setLoading(false);
                    }
                }
            );
        };

        fetchDmppData();

        return () => {
            cancel();
        };
    }, [selectedYear, executeDebouncedApi, cancel]);

    const chartData = {
        labels: dmppData.map((d) => d.mois),
        datasets: [
            {
                label: "DMPP Ouvertes",
                data: dmppData.map((d) => d.encours),
                backgroundColor: "rgba(239, 68, 68, 0.7)",
                borderColor: "rgb(239, 68, 68)",
                borderWidth: 1,
            },
            {
                label: "DMPP Clôturées",
                data: dmppData.map((d) => d.termine),
                backgroundColor: "rgba(34, 197, 94, 0.7)",
                borderColor: "rgb(34, 197, 94)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: `DMPP : Ouvertes vs Clôturées - ${selectedYear}`,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Nombre de DMPP",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Mois",
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
                    Chargement des statistiques DMPP {selectedYear}...
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <div className="card-title text-lg font-semibold text-gray-600 dark:text-gray-200">
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
                        className="px-3 py-1 border border-gray-300 rounded-lg bg-white dark:bg-gray-300 dark:border-gray-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
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

            <Bar data={chartData} options={options} />

            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-1 text-center">
                <div className="p-1 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-sm text-red-600 dark:text-red-400">Ouvertes</div>
                    <div className="text-lg font-bold text-red-700 dark:text-red-300">{totals.encours}</div>
                </div>
                <div className="p-1 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-sm text-green-600 dark:text-green-400">Clôturées</div>
                    <div className="text-lg font-bold text-green-700 dark:text-green-300">{totals.termine}</div>
                </div>
                <div className="p-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-sm text-blue-600 dark:text-blue-400">Total</div>
                    <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{totals.total}</div>
                </div>
            </div>

            {totals.total > 0 && (
                <div className="mt-3 text-center">
                    <div className="mt-4 pb-3 text-center text-sm text-gray-500 dark:text-white/70">
                        Taux de clôture: {((totals.termine / totals.total) * 100).toFixed(1)}%
                    </div>
                </div>
            )}
        </div>
    );
}