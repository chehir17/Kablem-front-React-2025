// import React, { useState } from "react";
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


const dmppData = [
    { mois: "Janvier", nbDmpp: 5 },
    { mois: "Février", nbDmpp: 8 },
    { mois: "Mars", nbDmpp: 12 },
    { mois: "Avril", nbDmpp: 7 },
    { mois: "Mai", nbDmpp: 10 },
    { mois: "Juin", nbDmpp: 6 },
];

const DmppPerMonth = () => {
    const chartData = {
        labels: dmppData.map((d) => d.mois),
        datasets: [
            {
                label: "Nombre de DMPP émises",
                data: dmppData.map((d) => d.nbDmpp),
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
                display: false, // inutile car une seule série
            },
            title: {
                display: true,
                text: "",
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

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="card-title text-lg font-semibold mb-4 text-gray-600 dark:text-gray-200">
                Nombre de DMPP émises par mois
            </div>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default DmppPerMonth;
