import { useEffect, useState } from "react";
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Pdf } from "../../icons";
import axios from "axios";
import { useApiDebounce } from "../../hooks/useApiDebounce";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Cnq = () => {
    const [dataBar, setDataBar] = useState<any>({
        labels: [],
        datasets: [],
    });

    const [barChartOptions, setBarChartOptions] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);
    const { executeDebouncedApi, cancel } = useApiDebounce(500);

    useEffect(() => {
        const fetchHNQData = async () => {
            await executeDebouncedApi(
                async () => {
                    try {
                        setLoading(true);
                        const response = await axios.get('http://localhost:8000/api/cnq');
                        const cnqData = response.data;

                        const months = cnqData.map((item: any) => item.id);
                        const values = cnqData.map((item: any) => item.data);

                        setDataBar({
                            labels: months,
                            datasets: [
                                {
                                    label: "HNQ/mois",
                                    data: values,
                                    backgroundColor: [
                                        "rgba(255, 134,159,0.6)",
                                        "rgba(98,182,239,0.6)",
                                        "rgba(255,218,128,0.6)",
                                        "rgba(113,205,205,0.6)",
                                        "rgba(170,128,252,0.6)",
                                        "rgba(255,177,101,0.6)",
                                        "rgba(110,180,40,0.6)",
                                        "rgba(120,120,90,0.6)",
                                        "rgba(130,30,80,0.6)",
                                        "rgba(240,40,70,0.6)",
                                        "rgba(130,250,60,0.6)",
                                        "rgba(190,160,50,0.6)",
                                    ],
                                    borderColor: "rgba(0,0,0,0.3)",
                                    borderWidth: 1,
                                },
                            ],
                        });

                        setBarChartOptions({
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    grid: { color: "rgba(0, 0, 0, 0.1)" },
                                },
                                y: {
                                    beginAtZero: true,
                                    grid: { color: "rgba(0, 0, 0, 0.1)" },
                                },
                            },
                        });
                    } catch (error) {
                        console.error("Erreur lors de la récupération des données HNQ", error);
                    } finally {
                        setLoading(false);
                    }
                }
            );
        };

        fetchHNQData();

        return () => {
            cancel();
        };
    }, [executeDebouncedApi, cancel]);

    const div2PDF = () => {
        const input = document.getElementById("chart-cnq");
        if (!input) return;
        html2canvas(input).then((canvas) => {
            const img = canvas.toDataURL("image/png");
            const pdf = new jsPDF("l", "pt", "a4");
            pdf.addImage(img, "PNG", 20, 20, 800, 500);
            pdf.save("hnq_chart.pdf");
        });
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                <div className="animate-pulse">
                    <div className="h-10 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="h-80 bg-gray-300 rounded"></div>
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                    Chargement des données ...
                </p>
            </div>
        );
    }

    return (
        <div
            id="chart-cnq"
            className="card rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
        >
            <div className="flex justify-between items-center">
                <h3 className="card-title text-lg font-semibold mb-4 text-gray-600 dark:text-gray-200 dark:text-gray-200"> Heures non qualité</h3>
                <button
                    onClick={div2PDF}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-xs hover:shadow-lg transition duration-400 text-white rounded shadow hover:bg-blue-700"
                >
                    <span>Exporter en PDF</span>
                    <Pdf className="w-4 h-4" />
                </button>
            </div>
            <div className="h-96">
                <Bar data={dataBar} options={barChartOptions} />
            </div>
        </div>
    );
};

export default Cnq;