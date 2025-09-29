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

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

export default function PpmClient() {
  const [chartData, setChartData] = useState<any>(null);
  const [isDark] = useState(false);

  useEffect(() => {

    const dummyPpm: [number, string][] = [
      [500, "05"],
      [2700, "06"],
      [1200, "07"],
      [200, "08"],
      [100, "09"],
    ];

    const values = dummyPpm.map(([val]) => val);
    const months = dummyPpm.map(([_, month]) => month);

    setChartData({
      labels: months,
      datasets: [
        {
          label: "Piéce par million client",
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
  }, []);

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: { size: 14, family: "Outfit, sans-serif" },
        },
        color: isDark ? "#000" : "#cdcdcdff",
      },
      title: {
        display: true,
        text: "",
        font: {
          size: 16,
          weight: "bold" as const,
          family: "Outfit, sans-serif"
        },
        color: isDark ? "#000" : "#cdcdcdff",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 500,
        },
        color: isDark ? "#000" : "#cdcdcdff",

      },
    },
  };

  if (!chartData) return <p className="card rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">Chargement de la courbe...</p>;

  return (
    <div className="card rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-md font-semibold text-gray-600 dark:text-gray-200">
        📉 Courbe de PPM client
      </h3>
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
