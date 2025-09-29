import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ScrapByZoneChart = () => {
    const dummyScrapData = [
        { zone_affe_prob: "Zone A", qnt_scrap: 120 },
        { zone_affe_prob: "Zone B", qnt_scrap: 80 },
        { zone_affe_prob: "Zone C", qnt_scrap: 200 },
        { zone_affe_prob: "Zone D", qnt_scrap: 50 },
        { zone_affe_prob: "Zone E", qnt_scrap: 150 },
    ];

    const labels = dummyScrapData.map((item) => item.zone_affe_prob);
    const values = dummyScrapData.map((item) => item.qnt_scrap);

    const data = {
        labels,
        datasets: [
            {
                label: "Quantité de Scrap",
                data: values,
                backgroundColor: "rgba(54, 162, 235, 0.7)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
        ],
    };


    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Quantité de Scrap",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Zone Affectée",
                },
            },
        },
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="card-title text-lg font-semibold text-gray-600 text-gray-600 dark:text-gray-200">
                 SCRAP par zone affectée
            </div>

            <Bar data={data} options={options} />
        </div>
    )

};

export default ScrapByZoneChart;
