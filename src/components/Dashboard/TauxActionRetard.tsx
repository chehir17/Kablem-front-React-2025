import { useState, useEffect, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import DownloadChart from "../../utils/DownloadChartProps ";
import axios from "axios";
import { useApiDebounce } from "../../hooks/useApiDebounce";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TauxActionRetard() {
    const [dataDoughnut, setDataDoughnut] = useState<any>(null);
    const chartRef = useRef<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasData, setHasData] = useState<boolean>(true);
    const { executeDebouncedApi, cancel } = useApiDebounce(10000);

    const formatPercentage = (value: number) => {
        return parseFloat(value.toFixed(2));
    };

    useEffect(() => {
        const fetchActionEnretard = async () => {
            await executeDebouncedApi(
                async () => {
                    try {
                        setLoading(true);
                        const response = await axios.get('http://localhost:8000/api/actionOnRetard',{
                            timeout: 10000,
                        });
                        const cnqData = response.data;

                        if (!cnqData || !Array.isArray(cnqData) || cnqData.length === 0 || cnqData.every(item => item === 0 || item === null || item === undefined)) {
                            setHasData(false);
                            setDataDoughnut(null);
                            return;
                        }

                        setHasData(true);

                        const done = formatPercentage(cnqData[0] || 0);
                        const notDone = formatPercentage(cnqData[1] || 0);
                        const retard = formatPercentage(cnqData[2] || 0);

                        const total = done + notDone + retard;
                        if (total === 0) {
                            setHasData(false);
                            setDataDoughnut(null);
                            return;
                        }

                        setDataDoughnut({
                            labels: [
                                `En retard ${retard}%`,
                                `Done ${done}%`,
                                `Non clôturées ${notDone}%`,
                            ],
                            datasets: [
                                {
                                    data: [retard, done, notDone],
                                    backgroundColor: ["#fe7c96", "#46BFBD", "#0275d8"],
                                    hoverBackgroundColor: ["#f06292", "#1fdbbf", "#0275d8"],
                                    borderWidth: 1,
                                },
                            ],
                        });
                    } catch (error) {
                        console.error("Erreur lors de la récupération des données En retard", error);
                        setHasData(false);
                        setDataDoughnut(null);
                    } finally {
                        setLoading(false);
                    }
                }
            );
        }
        fetchActionEnretard();

        return () => {
            cancel();
        };
    }, [executeDebouncedApi, cancel]);


    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                <div className="animate-pulse">
                    <div className="h-10 bg-gray-300 rounded mb-4"></div>
                    <div className="h-80 w-80 items-center bg-gray-300 rounded-full"></div>
                    <div className="mt-5">
                        <div className="h-5 bg-gray-300 rounded mb-2"></div>
                        <div className="h-5 bg-gray-300 rounded mb-2"></div>
                        <div className="h-5 bg-gray-300 rounded mb-2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!hasData || !dataDoughnut) {
        return (
            <div className="card rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-200">Taux des actions</h3>
                </div>

                <div className="h-80 flex flex-col items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto w-24 h-24 mb-4 text-gray-400">
                            <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                            No data to display
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Aucune donnée disponible pour le moment
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-200">Taux des actions</h3>
                <div className="flex gap-2">
                    <DownloadChart
                        chartRef={chartRef}
                        fileName="taux_actions"
                        type="png"
                    />
                    <DownloadChart
                        containerId="taux-actions-container"
                        fileName="taux_actions"
                        type="pdf"
                    />
                </div>
            </div>

            <div id="taux-actions-container" className="h-80 mx-auto">
                {dataDoughnut && (
                    <Doughnut
                        ref={chartRef}
                        data={dataDoughnut}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: function (context: any) {
                                            const value = context.parsed;
                                            return `${context.label}: ${formatPercentage(value)}%`;
                                        }
                                    }
                                }
                            }
                        }}
                    />
                )
                };
            </div>

            <div className="pt-4">
                <ul className="space-y-2">
                    <li className="flex items-center justify-between dark:text-gray-300">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                            Taux des Actions en retard
                        </div>
                        <span>{dataDoughnut.datasets[0].data[0]}%</span>
                    </li>
                    <li className="flex items-center justify-between dark:text-gray-300">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                            Taux des Actions done
                        </div>
                        <span>{dataDoughnut.datasets[0].data[1]}%</span>
                    </li>
                    <li className="flex items-center justify-between dark:text-gray-300">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                            Taux des Actions non clôturées
                        </div>
                        <span>{dataDoughnut.datasets[0].data[2]}%</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}