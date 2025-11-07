import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { useApiDebounce } from "../../hooks/useApiDebounce";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    borderColor: string;
    backgroundColor: string;
    pointBackgroundColor: string;
    pointBorderColor: string;
    pointHoverRadius: number;
    pointRadius: number;
    tension: number;
  }[];
}

const emptyChartData: ChartData = {
  labels: [],
  datasets: [
    {
      label: "Pièce par million client",
      data: [],
      fill: false,
      borderColor: "rgba(220, 53, 69, 1)",
      backgroundColor: "rgba(220, 53, 69, 0.2)",
      pointBackgroundColor: "#fff",
      pointBorderColor: "rgba(220, 53, 69, 1)",
      pointHoverRadius: 6,
      pointRadius: 4,
      tension: 0.3,
    },
  ],
};

export default function PpmClient() {
  const [chartData, setChartData] = useState<ChartData>(emptyChartData);
  const [hasData, setHasData] = useState(false);
  const [isDark] = useState(false);
  const { executeDebouncedApi, loading, error: apiError, cancel } = useApiDebounce(10000);

  useEffect(() => {
    const fetchPpm1Data = async () => {
      await executeDebouncedApi(
        async () => {
          const response = await axios.get('http://localhost:8000/api/ppm1', {
            timeout: 15000,
          });
          const Ppm = response.data;

          if (Ppm && Array.isArray(Ppm) && Ppm.length > 0) {
            const values = Ppm.map((item: any) => item[0]);
            const months = Ppm.map((item: any) => item[1]);

            setChartData({
              labels: months,
              datasets: [
                {
                  label: "Pièce par million client",
                  data: values,
                  fill: false,
                  borderColor: "rgba(220, 53, 69, 1)",
                  backgroundColor: "rgba(220, 53, 69, 0.2)",
                  pointBackgroundColor: "#fff",
                  pointBorderColor: "rgba(220, 53, 69, 1)",
                  pointHoverRadius: 6,
                  pointRadius: 4,
                  tension: 0.3,
                },
              ],
            });
            setHasData(true);
          } else {
            setChartData(emptyChartData);
            setHasData(false);
          }
        },
        {
          onError: (err) => {
            console.error("Erreur API PPM1:", err);
            setChartData(emptyChartData);
            setHasData(false);
          },
          maxRetries: 2,
          retryDelay: 10000
        }
      );
    };

    fetchPpm1Data();

    return () => {
      cancel();
    };
  }, [executeDebouncedApi, cancel]);

  useEffect(() => {
    if (apiError) {
      console.log("Erreur API détectée:", apiError);
    }
  }, [apiError]);

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: { size: 14, family: "Outfit, sans-serif" },
          color: isDark ? "#fff" : "#333",
        },
      },
      title: {
        display: true,
        text: hasData ? "Évolution du PPM Client" : "Aucune donnée PPM",
        font: {
          size: 16,
          weight: "bold" as const,
          family: "Outfit, sans-serif"
        },
        color: isDark ? "#fff" : "#333",
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? "#fff" : "#333",
        },
        grid: {
          color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 500,
          color: isDark ? "#fff" : "#333",
        },
        grid: {
          color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-75 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }


  if (apiError || !hasData) {
    return (
      <div className="card rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-200">
            Courbe de PPM client
          </h3>
        </div>

        <div className="h-80 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 mb-4 text-gray-400">
              {apiError ? (

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
              {apiError ? "Erreur de chargement" : "No data to display"}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {apiError
                ? "Impossible de charger les données PPM pour le moment"
                : "Aucune donnée PPM disponible pour le moment"
              }
            </p>
            {apiError && (
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
    <div className="card rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-md font-semibold text-gray-600 dark:text-gray-200">
        Courbe de PPM client
      </h3>

      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}