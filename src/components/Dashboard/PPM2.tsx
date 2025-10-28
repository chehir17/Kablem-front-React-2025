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
  ChartData,
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

const emptyChartData: ChartData = {
  labels: [],
  datasets: [
    {
      label: "Piéce par million P1 P2",
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

export default function Ppm2() {
  const [chartData, setChartData] = useState<any>(emptyChartData);
  const { executeDebouncedApi, loading, error, cancel } = useApiDebounce(500);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const fetchPpm2Data = async () => {
      await executeDebouncedApi(
        async () => {
          const responce = await axios.get('http://localhost:8000/api/ppm2');
          const Ppm2 = responce.data;
          if (Ppm2 && Array.isArray(Ppm2) && Ppm2.length > 0) {
            const values = Ppm2.map((item: any) => item[0]);
            const months = Ppm2.map((item: any) => item[1]);

            setChartData({
              labels: months,
              datasets: [
                {
                  label: "Piéce par million P1 P2",
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
            setChartData(emptyChartData);
            console.error("Erreur API PPM2:", err);
            setHasData(false);
          }
        }
      );
    }

    fetchPpm2Data();

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
        },
      },
      title: {
        display: true,
        text: "",
        font: {
          size: 16,
          weight: "bold" as const,
          family: "Outfit, sans-serif"
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 500,
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
        Courbe de PPM P1 P2
      </h3>
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
