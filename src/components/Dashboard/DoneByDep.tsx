import { useState, useEffect } from "react";
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

export default function DoneByDep() {
  const [chartData, setChartData] = useState<any>(null);
  const [isDark,] = useState(false);

  useEffect(() => {
    const dummyDone = {
      Qualité: [1, 2, 3, 4],
      Maintenance: [1, 2],
      Production: [1, 2, 3],
      Indust: [1],
      Logistique: [1, 2, 3, 4, 5],
      Comptabilité_Finance: [1, 2, 3],
      RH: [1],
      Achat: [],
    };

    setChartData({
      labels: [
        "Qualité",
        "Maintenance",
        "Production",
        "Indust",
        "Logistique",
        "Comptabilité & Finance",
        "RH",
        "Achat",
      ],
      datasets: [
        {
          label: "Plans d'action clôturés (Done)",
          data: [
            dummyDone.Qualité.length,
            dummyDone.Maintenance.length,
            dummyDone.Production.length,
            dummyDone.Indust.length,
            dummyDone.Logistique.length,
            dummyDone.Comptabilité_Finance.length,
            dummyDone.RH.length,
            dummyDone.Achat.length,
          ],
          backgroundColor: [
            // "rgba(54, 163, 235, 0.8)",
            "rgba(75, 192, 192, 1)",
            // "rgba(255, 205, 86, 0.8)",
            // "rgba(153, 102, 255, 0.8)",
            // "rgba(255, 99, 132, 0.8)",
            // "rgba(201, 203, 207, 0.8)",
            // "rgba(255, 159, 64, 0.8)",
            // "rgba(255, 87, 34, 0.8)",
          ],
          borderColor: "rgba(0,0,0,0.2)",
          borderWidth: 1,
          borderRadius: 6,
          hoverBackgroundColor:  "rgba(10, 152, 107, 0.81)",
        },
      ],
    });
  }, []);

  if (!chartData)
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03]">
        Chargement...
      </div>
    );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-md font-semibold mb-4 text-gray-600 dark:text-gray-200">
        Actions clôturées par département (Done)
      </h3>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          indexAxis: "y",
          plugins: {
            legend: {
              position: "top" as const,
              labels: { font: { size: 12, family: "Outfit, sans-serif" }, color: isDark ? "#333" : "#c3c3c3ff" },
            },
            title: {
              display: true,
              text: "Suivi des plans d'action clôturés par département",
              font: { size: 14, family: "Outfit, sans-serif", weight: "bold" },
              color: isDark ? "#222": "#cdcdcdff",
            },
          },
          animation: {
            duration: 1200,
            easing: "easeOutBounce",
            delay: (context: any) => context.dataIndex * 150,
          },
          scales: {
            x: { grid: { color:"rgba(200,200,200,0.2)" }, ticks: { font: { size: 12 } }, },
            y: { grid: { display: false }, ticks: { font: { size: 12 } }},
          },
        }}
      />
    </div>
  );
}
