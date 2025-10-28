import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import axios from "axios";
import { useApiDebounce } from "../../hooks/useApiDebounce";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
);

const ScrapCostOverTime = () => {
    const [timeUnit, setTimeUnit] = useState<"day" | "month" | "year">("day");
    const [chartData, setChartData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const [CoutselectedYear, setCoutselectedYear] = useState<number>(new Date().getFullYear());
    const [error, setError] = useState<string | null>(null);
    const { executeDebouncedApi, cancel } = useApiDebounce(500);

    const fetchAvailableYears = async () => {
        try {
            setError(null);
            const response = await axios.get('http://localhost:8000/api/scrap/available-years');
            console.log(" Réponse années disponibles:", response.data);

            const years = response.data.years || [2023, 2024, 2025];
            setAvailableYears(years);

        } catch (error: any) {
            console.error("Erreur lors du chargement des années:", error);
            if (error.response?.status === 429) {
                setError("Trop de requêtes - Veuillez patienter quelques secondes");
            } else {
                setError("Impossible de charger les années");
            }
            setAvailableYears([2023, 2024, 2025]);
        }
    };

    const adaptDataToChart = (apiData: any) => {
        console.log(" Adaptation des données:", apiData);

        if (apiData.success && Array.isArray(apiData.data)) {
            return {
                labels: apiData.data.map((d: any) => d.date_prod),
                datasets: [
                    {
                        label: "Coût du Scrap (€)",
                        data: apiData.data.map((d: any) => ({
                            x: d.date_prod,
                            y: d.cout_final
                        })),
                        borderColor: "#4F46E5",
                        backgroundColor: "rgba(79, 70, 229, 0.2)",
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointBackgroundColor: "#4F46E5",
                    },
                ],
            };
        }

        if (Array.isArray(apiData)) {
            return {
                labels: apiData.map((d: any) => d.date_prod || d.date),
                datasets: [
                    {
                        label: "Coût du Scrap (€)",
                        data: apiData.map((d: any) => ({
                            x: d.date_prod || d.date,
                            y: d.cout_final || d.cost || d.total
                        })),
                        borderColor: "#4F46E5",
                        backgroundColor: "rgba(79, 70, 229, 0.2)",
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointBackgroundColor: "#4F46E5",
                    },
                ],
            };
        }
        if (apiData.data && Array.isArray(apiData.data)) {
            return {
                labels: apiData.data.map((d: any) => d.date_prod || d.date),
                datasets: [
                    {
                        label: "Coût du Scrap (€)",
                        data: apiData.data.map((d: any) => ({
                            x: d.date_prod || d.date,
                            y: d.cout_final || d.cost || d.total
                        })),
                        borderColor: "#4F46E5",
                        backgroundColor: "rgba(79, 70, 229, 0.2)",
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointBackgroundColor: "#4F46E5",
                    },
                ],
            };
        }

        return null;
    };

    const fetchScrapData = async () => {
        await executeDebouncedApi(
            async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await axios.get(`http://localhost:8000/api/scrap/cost-over-time`, {
                        params: {
                            timeUnit: timeUnit,
                            year: CoutselectedYear
                        }
                    });

                    const adaptedData = adaptDataToChart(response.data);

                    if (adaptedData) {
                        setChartData(adaptedData);
                    } else {
                        setError("Impossible d'adapter les données reçues");
                        console.warn("Structure non reconnue:", response.data);
                    }

                } catch (error: any) {
                    console.error(" Erreur lors du chargement des données:", error);
                    if (error.response?.status === 429) {
                        setError("Trop de requêtes - Veuillez patienter quelques secondes avant de réessayer");
                    } else if (error.response) {
                        console.error("Détails de l'erreur:", error.response.data);
                        setError(`Erreur ${error.response.status}: ${error.response.statusText}`);
                    } else if (error.request) {
                        setError("Pas de réponse du serveur");
                    } else {
                        setError("Erreur de configuration de la requête");
                    }
                } finally {
                    setLoading(false);
                }
            }
        );
    };

    useEffect(() => {
        fetchAvailableYears();
    }, []);

    useEffect(() => {
        fetchScrapData();

        return () => {
            cancel();
        };
    }, [timeUnit, CoutselectedYear, executeDebouncedApi, cancel]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: `Coût du Scrap - ${CoutselectedYear} (Vue par ${timeUnit})`,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `Coût: ${context.parsed.y}€`;
                    }
                }
            }
        },
        scales: {
            x: {
                type: "time" as const,
                time: {
                    unit: timeUnit,
                    tooltipFormat: "dd/MM/yyyy",
                    displayFormats: {
                        day: "dd MMM",
                        month: "MMM yyyy",
                        year: "yyyy",
                    },
                },
                title: {
                    display: true,
                    text: "Date de production",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Coût final (€)",
                },
                beginAtZero: true,
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
                    Chargement des données scrap {CoutselectedYear}...
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex justify-between items-center mb-4">
                <div className="card-title text-lg font-semibold text-gray-600 dark:text-gray-200">
                    Courbe du coût total du scrap dans le temps
                </div>

                <div className="flex gap-2">
                    <select
                        value={CoutselectedYear}
                        onChange={(e) => setCoutselectedYear(Number(e.target.value))}
                        className="border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:text-gray-200"
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    <select
                        value={timeUnit}
                        onChange={(e) => setTimeUnit(e.target.value as "day" | "month" | "year")}
                        className="border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:text-gray-200"
                    >
                        <option value="day">Jour</option>
                        <option value="month">Mois</option>
                        <option value="year">Année</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className={`px-4 py-3 rounded mb-4 ${error.includes("Trop de requêtes")
                        ? "bg-yellow-50 border border-yellow-200 text-yellow-700"
                        : "bg-red-50 border border-red-200 text-red-700"
                    }`}>
                    <strong>{error.includes("Trop de requêtes") ? "Attention:" : "Erreur:"}</strong> {error}
                    <div className="text-sm mt-1">
                        {error.includes("Trop de requêtes")
                            ? "Le système se protège contre les requêtes trop rapides. Réessayez dans quelques secondes."
                            : "Vérifiez la console pour plus de détails"
                        }
                    </div>
                </div>
            )}

            {chartData ? (
                <Line data={chartData} options={options} />
            ) : (
                <div className="text-center py-8 text-gray-500">
                    Aucune donnée scrap disponible pour la période sélectionnée
                </div>
            )}
        </div>
    );
};

export default ScrapCostOverTime;