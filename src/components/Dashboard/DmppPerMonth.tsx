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

const DmppPerMonth = () => {
    const [dmppData, setDmppData] = useState<any[]>([]);
    const [annee, setAnnee] = useState<string>('');
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { executeDebouncedApi, cancel } = useApiDebounce(10000);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

    useEffect(() => {
        const fetchDmppData = async () => {
            await executeDebouncedApi(
                async () => {
                    try {
                        setLoading(true);
                        setError(null);

                        const response = await axios.get(`http://localhost:8000/api/dmpp/mensuel/${selectedYear}`, {
                            timeout: 10000,
                        });
                        console.log('Réponse API reçue:', response.data);

                        if (response.data && Array.isArray(response.data.dmppData)) {
                            setDmppData(response.data.dmppData);
                            setAnnee(response.data.annee || selectedYear.toString());
                        } else if (Array.isArray(response.data)) {
                            setDmppData(response.data);
                            setAnnee(selectedYear.toString());
                        } else {
                            throw new Error('Format de données invalide');
                        }

                    } catch (err: any) {
                        console.error(' Erreur:', err);
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
        labels: dmppData.map(d => d.mois),
        datasets: [
            {
                label: "Nombre de DMPP émises",
                data: dmppData.map(d => d.nbDmpp),
                backgroundColor: "rgba(59, 130, 246, 0.7)",
                borderColor: "rgb(59, 130, 246)",
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
                text: `DMPP émises en ${selectedYear}`,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: "Nombre de DMPP" },
            },
            x: {
                title: { display: true, text: "Mois" },
            },
        },
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                    <div className="h-64 bg-gray-300 rounded"></div>
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">Chargement des données DMPP {selectedYear}...</p>
            </div>
        );
    }

    const totalDmpp = dmppData.reduce((sum, item) => sum + item.nbDmpp, 0);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-2 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-3">
                <div className="card-title text-lg font-semibold text-gray-600 dark:text-gray-200">
                    Nombre de DMPP émises par mois
                </div>

                <div className="flex items-center gap-3">
                    <label htmlFor="year-select" className="text-sm text-gray-600 dark:text-gray-400">
                        Année:
                    </label>
                    <select
                        id="year-select"
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



            <div className="mt-5 pb-9">
                {chartData && chartData.labels && chartData.labels.length > 0 ? (
                    <Bar data={chartData} options={options} />
                ) : (
                    <div className="h-64 flex items-center justify-center">
                        <p className="text-gray-500">Aucune donnée à afficher</p>
                    </div>
                )}
            </div>

            <div className="mt-4 pb-6 text-center text-sm text-gray-500 dark:text-white/70">
                Total {selectedYear}: {totalDmpp} DMPP
            </div>
        </div>
    );
};

export default DmppPerMonth;