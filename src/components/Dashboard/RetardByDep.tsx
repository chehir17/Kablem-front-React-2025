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

export default function RetardByDep() {
  const [chartData, setChartData] = useState<any>(null);
  const [isDark] = useState(false);

  useEffect(() => {
    const dummyData = {
      Qualité: [1, 2, 3],
      Maintenance: [1],
      Production: [1, 2],
      Indust: [],
      Logistique: [1, 2, 3, 4],
      Comptabilité_Finance: [1, 2],
      RH: [1],
      Achat: [1, 2, 3],
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
          label: "Plans d'action en retard",
          data: [
            dummyData.Qualité.length,
            dummyData.Maintenance.length,
            dummyData.Production.length,
            dummyData.Indust.length,
            dummyData.Logistique.length,
            dummyData.Comptabilité_Finance.length,
            dummyData.RH.length,
            dummyData.Achat.length,
          ],
          backgroundColor: [
            "rgba(54, 163, 235, 1)",
          ],
          borderColor: "rgba(0,0,0,0.2)",
          borderWidth: 1,
          borderRadius: 5,
          hoverBackgroundColor: "rgba(54, 84, 235, 1)",
        },
      ],
    });
  }, []);

  if (!chartData) return <p className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">Chargement...</p>;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <h3 className="card-title text-md font-semibold mb-4 text-gray-600 dark:text-gray-200">
        Actions en retard par département
      </h3>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          indexAxis: "y",
          plugins: {
            legend: {
              position: "top" as const,
              labels: {
                font: { size: 12, family: "Outfit, sans-serif" },
                color: isDark ? "#3333" : "#aeaeaeff"
              },
            },
            title: {
              display: true,
              text: "Suivi des plans d'action en retard",
              font: { size: 14, family: "Outfit, sans-serif", weight: "bold" },
              color: isDark ? "#2222" : "#bebcbcff"
            },
          },
          animation: {
            duration: 1200,
            easing: "easeOutBounce",
            delay: (context: any) => context.dataIndex * 150,
          },
          scales: {
            x: {
              grid: { color: "rgba(200,200,200,0.2)" },
              ticks: { font: { size: 12, family: "Outfit, sans-serif" } },
            },
            y: {
              grid: { display: false },
              ticks: { font: { size: 12, family: "Outfit, sans-serif" } },
            },
          },
        }}
      />
    </div>
  );
}
