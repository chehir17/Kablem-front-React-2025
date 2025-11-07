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
    const { executeDebouncedApi, cancel } = useApiDebounce(11000);

    const fetchAvailableYears = async () => {
        try {
            setError(null);
            const response = await axios.get('http://localhost:8000/api/scrap/available-years', {
                timeout: 11000,
            });
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

    useEffect(() => {
        fetchAvailableYears();
    }, [CoutselectedYear]);

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
                        },
                        timeout: 1100,
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

                    setChartData(null);
                } finally {
                    setLoading(false);
                }
            }
        );
    };



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

    if (error || !chartData || chartData.labels.length === 0) {
        return (
            <div className="card rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-200">
                        Courbe du coût total du scrap dans le temps
                    </h3>

                    <div className="flex items-center gap-3">
                        <label htmlFor="year-select-scrap" className="text-sm text-gray-600 dark:text-gray-400">
                            Année:
                        </label>
                        <select
                            id="year-select-scrap"
                            value={CoutselectedYear}
                            onChange={(e) => setCoutselectedYear(Number(e.target.value))}
                            className="px-3 py-1 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        >
                            {availableYears.map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="h-80 flex flex-col items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto w-24 h-24 mb-4 text-gray-400">
                            {error ? (
                                <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                            ) : (
                                <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                                </svg>
                            )}
                        </div>
                        <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                            {error ? "Erreur de chargement" : "No data to display"}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {error
                                ? "Impossible de charger les données scrap pour le moment"
                                : `Aucune donnée scrap disponible pour ${CoutselectedYear}`
                            }
                        </p>
                        {error && (
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                Réessayer
                            </button>
                        )}
                    </div>
                </div>
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