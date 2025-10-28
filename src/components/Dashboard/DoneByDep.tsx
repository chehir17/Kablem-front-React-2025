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
import axios from "axios";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DoneByDep() {
  const [chartData, setChartData] = useState<any>(null);
  const [isDark,] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActionDone = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:8000/api/bydep');
        const data = response.data;

        if (typeof data !== 'object' || data === null) {
          throw new Error("Format de données invalide");
        }
        const labels = Object.keys(data);
        const values = Object.values(data) as number[];

        if (labels.length === 0) {
          setChartData(null);
          return;
        }

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Plan d'action Done",
              data: values,
              backgroundColor: "rgba(54, 163, 235, 1)",
              borderColor: "rgba(0,0,0,0.2)",
              borderWidth: 1,
              borderRadius: 10,
              hoverBackgroundColor: "rgba(54, 84, 235, 1)",

            },
          ],
        });

      } catch (error) {
        console.error(" Erreur lors de la récupération des données", error);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchActionDone();
  }, []);


  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mt-2 items-center flex"></div>
          <div className="h-4 bg-gray-300 rounded mt-8"></div>
          <div className="h-4 bg-gray-300 rounded mt-3"></div>
          <div className="h-4 bg-gray-300 rounded mt-3"></div>
          <div className="h-4 bg-gray-300 rounded mt-3"></div>
          <div className="h-4 bg-gray-300 rounded mt-3"></div>
          <div className="h-4 bg-gray-300 rounded mt-3"></div>
          <div className="h-4 bg-gray-300 rounded mt-3"></div>
          <div className="h-4 bg-gray-300 rounded mt-3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="text-center py-8">
          <div className="text-red-600 font-semibold mb-2">Erreur</div>
          <div className="text-gray-600 text-sm">{error}</div>
        </div>
      </div>
    );
  }

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
              labels: { font: { size: 12, family: "Outfit, sans-serif", weight: "normal" }, color: isDark ? "#333" : "#898989ff" },
            },
            title: {
              display: true,
              text: "Suivi des plans d'action clôturés par département",
              font: { size: 14, family: "Outfit, sans-serif", weight: "normal" },
              color: isDark ? "#222" : "#828282ff",
            },
          },
          animation: {
            duration: 1200,
            easing: "easeOutBounce",
            delay: (context: any) => context.dataIndex * 150,
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: { color: "rgba(200,200,200,0.2)" },
              ticks: {
                font: { size: 12 },
                stepSize: 1,
              },
              title: {
                display: true,
                text: "Nombre d'actions terminées",
                color: isDark ? "#1b1b1bff" : "#848282ff"
              }
            },
            y: { grid: { display: false }, ticks: { font: { size: 12 } } },
          },
        }}
      />
    </div>
  );
}
