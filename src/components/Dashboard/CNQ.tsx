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
    const [hasData, setHasData] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { executeDebouncedApi, loading: apiLoading, cancel, error: apiError } = useApiDebounce(15000);

    useEffect(() => {
        const fetchHNQData = async () => {
            await executeDebouncedApi(
                async () => {
                    try {
                        setLoading(true);
                        setError(null);
                        const response = await axios.get('http://localhost:8000/api/cnq', {
                            timeout: 15000,

                        });
                        const cnqData = response.data;

                        if (!cnqData || (Array.isArray(cnqData) && cnqData.length === 0)) {
                            setHasData(false);
                            setDataBar({
                                labels: [],
                                datasets: [],
                            });
                            return;
                        }

                        let dataArray = cnqData;
                        if (cnqData.data && Array.isArray(cnqData.data)) {
                            dataArray = cnqData.data;
                        } else if (cnqData.success && Array.isArray(cnqData.data)) {
                            dataArray = cnqData.data;
                        }

                        if (!Array.isArray(dataArray) || dataArray.length === 0) {
                            setHasData(false);
                            setDataBar({
                                labels: [],
                                datasets: [],
                            });
                            return;
                        }

                        setHasData(true);

                        const months = dataArray.map((item: any) =>
                            item.month || item.mois || item.id || item.date || "Mois inconnu"
                        );
                        const values = dataArray.map((item: any) =>
                            Number(item.value) || Number(item.valeur) || Number(item.data) || Number(item.hnq) || 0
                        );

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
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Heures Non Qualité par Mois'
                                },
                                legend: {
                                    display: true,
                                    position: 'top' as const,
                                }
                            },
                            scales: {
                                x: {
                                    grid: {
                                        color: "rgba(0, 0, 0, 0.1)",
                                        drawBorder: false
                                    },
                                    title: {
                                        display: true,
                                        text: 'Mois'
                                    }
                                },
                                y: {
                                    beginAtZero: true,
                                    grid: {
                                        color: "rgba(0, 0, 0, 0.1)",
                                        drawBorder: false
                                    },
                                    title: {
                                        display: true,
                                        text: 'Heures'
                                    }
                                },
                            },
                        });
                    } catch (error) {
                        console.error("Erreur lors de la récupération des données HNQ", error);
                        setError("Erreur de chargement des données");
                        setHasData(false);
                        setDataBar({
                            labels: [],
                            datasets: [],
                        });
                    } finally {
                        setLoading(false);
                    }
                },
                {
                    onError: (err) => {
                        console.error("Erreur dans useApiDebounce:", err);
                        setError("Erreur lors du chargement des données");
                        setHasData(false);
                        setLoading(false);
                    },
                    retryDelay: 10000
                }
            );
        };

        fetchHNQData();

        return () => {
            cancel();
        };
    }, [executeDebouncedApi, cancel]);

    useEffect(() => {
        if (apiError) {
            console.log("Erreur API détectée:", apiError);
        }
    }, [apiError]);

    const div2PDF = () => {
        if (!hasData || error || !dataBar.labels.length) {
            alert("Aucune donnée disponible pour l'export");
            return;
        }

        const input = document.getElementById("chart-cnq");
        if (!input) return;

        html2canvas(input).then((canvas) => {
            const img = canvas.toDataURL("image/png");
            const pdf = new jsPDF("l", "pt", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 20;

            pdf.addImage(img, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save("hnq_chart.pdf");
        }).catch((err) => {
            console.error("Erreur lors de la génération du PDF:", err);
            alert("Erreur lors de l'export PDF");
        });
    };

    if (apiLoading || loading) {
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

    const hasChartData = hasData &&
        !error &&
        dataBar?.labels?.length > 0 &&
        dataBar?.datasets?.length > 0 &&
        dataBar.datasets[0]?.data?.length > 0;

    if (!hasChartData) {
        return (
            <div className="card rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-200">
                        Heures non qualité
                    </h3>
                </div>

                <div className="h-96 flex flex-col items-center justify-center">
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
                            {error ? "Erreur de chargement" : "Aucune donnée disponible"}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {error
                                ? "Impossible de charger les données pour le moment"
                                : "Aucune donnée HNQ disponible pour le moment"
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
        <div
            id="chart-cnq"
            className="card rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-200">
                    Heures non qualité
                </h3>
                <button
                    onClick={div2PDF}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-xs hover:shadow-lg transition duration-400 text-white rounded shadow hover:bg-blue-700"
                    disabled={!hasChartData}
                >
                    <span>Exporter en PDF</span>
                    <Pdf className="w-4 h-4" />
                </button>
            </div>
            <div className="h-96">
                {dataBar && dataBar.labels && dataBar.labels.length > 0 ? (
                    <Bar data={dataBar} options={barChartOptions} />
                ) : (
                    <div className="h-64 flex items-center justify-center">
                        <p className="text-gray-500">Aucune donnée à afficher</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cnq;