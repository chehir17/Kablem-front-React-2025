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
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [error, setError] = useState<string | null>(null);

    // Récupérer les années disponibles
    const fetchAvailableYears = async () => {
        try {
            setError(null);
            const response = await axios.get('http://localhost:8000/api/scrap/available-years');
            console.log("✅ Réponse années disponibles:", response.data);
            
            if (response.data.success) {
                setAvailableYears(response.data.years);
            } else {
                setError("Erreur lors du chargement des années");
                setAvailableYears([2023, 2024, 2025]);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des années:", error);
            setError("Impossible de charger les années");
            setAvailableYears([2023, 2024, 2025]);
        }
    };

    // Fonction pour adapter les données selon la structure de réponse
    const adaptDataToChart = (apiData: any) => {
        console.log("🔧 Adaptation des données:", apiData);

        // Si la réponse a la structure standard avec success: true
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

        // Si la réponse a une structure différente mais contient des données
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

        // Si c'est un objet avec une propriété data
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

    // Récupérer les données du backend
    const fetchScrapData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8000/api/scrap/cost-over-time`, {
                params: {
                    timeUnit: timeUnit,
                    year: selectedYear
                }
            });
            
            console.log("✅ Réponse API complète:", response);
            console.log("✅ Données reçues:", response.data);

            const adaptedData = adaptDataToChart(response.data);
            
            if (adaptedData) {
                setChartData(adaptedData);
            } else {
                setError("Impossible d'adapter les données reçues");
                console.warn("Structure non reconnue:", response.data);
            }

        } catch (error: any) {
            console.error("❌ Erreur lors du chargement des données:", error);
            if (error.response) {
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
    };

    useEffect(() => {
        fetchAvailableYears();
    }, []);

    useEffect(() => {
        fetchScrapData();
    }, [timeUnit, selectedYear]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: `Coût du Scrap - ${selectedYear} (Vue par ${timeUnit})`,
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
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
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
                <div className="text-gray-600">Chargement des données scrap...</div>
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
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
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
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>Erreur:</strong> {error}
                    <div className="text-sm mt-1">
                        Vérifiez la console pour plus de détails
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