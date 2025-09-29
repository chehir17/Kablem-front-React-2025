// import React from "react";
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


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const dataPoints = [
    { mois: "Janvier", ouvertes: 12, cloturees: 8 },
    { mois: "Février", ouvertes: 9, cloturees: 10 },
    { mois: "Mars", ouvertes: 15, cloturees: 12 },
    { mois: "Avril", ouvertes: 7, cloturees: 11 },
    { mois: "Mai", ouvertes: 10, cloturees: 14 },
];

const NcOpenVsClosed = () => {
    const chartData = {
        labels: dataPoints.map((d) => d.mois),
        datasets: [
            {
                label: "NC Ouvertes",
                data: dataPoints.map((d) => d.ouvertes),
                backgroundColor: "rgba(239, 68, 68, 0.7)",
                borderColor: "rgb(239, 68, 68)",
                borderWidth: 1,
            },
            {
                label: "NC Clôturées",
                data: dataPoints.map((d) => d.cloturees),
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
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Nombre de NC",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Période",
                },
            },
        },
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="card-title text-lg font-semibold mb-4 text-gray-600 dark:text-gray-200">
                Non-conformités : Ouvertes vs Clôturées
            </div>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default NcOpenVsClosed;
