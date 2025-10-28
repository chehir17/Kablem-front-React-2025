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

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TauxActionRetard() {
    const [dataDoughnut, setDataDoughnut] = useState<any>(null);
    const chartRef = useRef<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const formatPercentage = (value: number) => {
        return parseFloat(value.toFixed(2));
    };

    useEffect(() => {
        const fetchActionEnretard = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8000/api/actionOnRetard');
                const cnqData = response.data;

                const done = formatPercentage(cnqData[0]);
                const notDone = formatPercentage(cnqData[1]);
                const retard = formatPercentage(cnqData[2]);

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
            } finally {
                setLoading(false);
            }
        }
        fetchActionEnretard();
    }, []);

    if (!dataDoughnut)
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

            <div className="h-80 mx-auto">
                <Doughnut
                    ref={chartRef}
                    data={dataDoughnut}
                    options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(context: any) {
                                        const value = context.parsed;
                                        return `${context.label}: ${formatPercentage(value)}%`;
                                    }
                                }
                            }
                        }
                    }}
                />
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