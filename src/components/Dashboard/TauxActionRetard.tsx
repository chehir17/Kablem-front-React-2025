import { useState, useEffect, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import DownloadChart from "../../utils/DownloadChartProps ";


ChartJS.register(ArcElement, Tooltip, Legend);

export default function TauxActionRetard() {
    const [dataDoughnut, setDataDoughnut] = useState<any>(null);
    const chartRef = useRef<any>(null);

    useEffect(() => {
        // 🔹 Dummy data
        const dummyAction = {
            done: 45,
            retard: 30,
            notDone: 25,
        };

        setDataDoughnut({
            labels: [
                `En retard ${dummyAction.retard}%`,
                `Done ${dummyAction.done}%`,
                `Non clôturées ${dummyAction.notDone}%`,
            ],
            datasets: [
                {
                    data: [dummyAction.retard, dummyAction.done, dummyAction.notDone],
                    backgroundColor: ["#fe7c96", "#46BFBD", "#0275d8"],
                    hoverBackgroundColor: ["#f06292", "#1fdbbf", "#0275d8"],
                    borderWidth: 1,
                },
            ],
        });
    }, []);

    // const downloadPNG = () => {
    //     if (chartRef.current) {
    //         const chartInstance = chartRef.current;
    //         const url = chartInstance.toBase64Image();
    //         const link = document.createElement("a");
    //         link.href = url;
    //         link.download = "taux_actions.png";
    //         link.click();
    //     }
    // };

    if (!dataDoughnut)
        return (
            <p className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5">
                Chargement du graphique...
            </p>
        );

    return (
        <div className="card rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-200"> Taux des actions</h3>
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
                    options={{ responsive: true, maintainAspectRatio: false }}
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
