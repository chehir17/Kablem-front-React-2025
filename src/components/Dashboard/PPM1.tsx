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
  const { executeDebouncedApi, loading, error, cancel } = useApiDebounce(500);

  useEffect(() => {
    const fetchPpm1Data = async () => {
      await executeDebouncedApi(
        async () => {
          const response = await axios.get('http://localhost:8000/api/ppm1');
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
          }
        }
      );
    };

    fetchPpm1Data();

    return () => {
      cancel();
    };
  }, [executeDebouncedApi, cancel]);

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

  return (
    <div className="card rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-md font-semibold text-gray-600 dark:text-gray-200">
        Courbe de PPM client
      </h3>
      
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
          <strong>Information:</strong> {error}
        </div>
      )}

      <div className="h-80">
        {hasData ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">📊</p>
              <p>Aucune donnée PPM disponible</p>
              <p className="text-sm mt-1">Vérifiez que les données existent pour la période sélectionnée</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}