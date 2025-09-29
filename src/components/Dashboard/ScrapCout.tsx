import React, { useState } from "react";
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

const dataPoints = [
    { date_prod: "2025-01-01", cout_final: 1200 },
    { date_prod: "2025-01-05", cout_final: 800 },
    { date_prod: "2025-01-10", cout_final: 1600 },
    { date_prod: "2025-01-15", cout_final: 2200 },
    { date_prod: "2025-01-20", cout_final: 900 },
    { date_prod: "2025-01-25", cout_final: 1300 },
    { date_prod: "2025-02-05", cout_final: 800 },
    { date_prod: "2025-02-10", cout_final: 1800 },
    { date_prod: "2025-02-15", cout_final: 3200 },
    { date_prod: "2025-02-20", cout_final: 1500 },
    { date_prod: "2025-02-25", cout_final: 1300 },
];

const ScrapCostOverTime = () => {
    const [timeUnit, setTimeUnit] = useState<"day" | "month" | "year">("day");

    const chartData = {
        labels: dataPoints.map((d) => d.date_prod),
        datasets: [
            {
                label: "Coût du Scrap",
                data: dataPoints.map((d) => ({ x: d.date_prod, y: d.cout_final })),
                borderColor: "#4F46E5",
                backgroundColor: "rgba(79, 70, 229, 0.2)",
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: "#4F46E5",
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
                text: `Vue par ${timeUnit}`,
            },
        },
        scales: {
            x: {
                type: "time",
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
                    text: "Coût final",
                },
            },
        },
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex justify-between items-center mb-4">
                <div className="card-title text-lg font-semibold text-gray-600 dark:text-gray-200">
                    Courbe du coût total du scrap dans le temps
                </div>

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

            <Line data={chartData} options={options} />
        </div>
    );
};

export default ScrapCostOverTime;
