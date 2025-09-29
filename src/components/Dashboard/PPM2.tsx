import  { useEffect, useState } from "react";
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

export default function Ppm2() {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {

    const dummyPpm: [number, string][] = [
      [1500, "05"],
      [2700, "06"],
      [2500, "07"],
    ];

    const values = dummyPpm.map(([val]) => val);
    const months = dummyPpm.map(([_, month]) => month);

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

  if (!chartData) return <p className="card rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">Chargement de la courbe...</p>;

  return (
    <div className="card rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-md font-semibold text-gray-600 dark:text-gray-200">
        📉 Courbe de PPM P1 P2
      </h3>
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
