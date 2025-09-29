import React, { useEffect, useState } from "react";
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

const ByUser: React.FC = () => {
  const [dataBar, setDataBar] = useState<any>(null);
  const [barChartOptions, setBarChartOptions] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const dummyByUser = [12, 25, 8]; // [retard, done, non cloturées]

    setDataBar({
      labels: ["Actions en retard", "Actions done", "Actions non clôturées"],
      datasets: [
        {
          label: "Votre performance",
          data: dummyByUser,
          backgroundColor: [
            "rgba(255, 134, 159, 0.6)",
            "rgba(98, 182, 239, 0.6)",
            "rgba(255, 218, 128, 0.6)",
          ],
          borderColor: [
            "rgba(255, 134, 159, 1)",
            "rgba(98, 182, 239, 1)",
            "rgba(255, 218, 128, 1)",
          ],
          borderWidth: 1,
        },
      ],
    });

    setBarChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" as const },
        title: { display: false },
      },
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

    setLoading(false);
  }, []);

  if (loading) {
    return <p className="p-4">Chargement de vos performances...</p>;
  }

  return (
      <div className="card rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="card-body">
          <h3 className="card-title text-lg font-semibold mb-4 text-gray-600 dark:text-gray-200">
             Votre performance
          </h3>
          <div className="h-96">
            {dataBar ? (
              <Bar data={dataBar} options={barChartOptions} />
            ) : (
              <p>Aucune donnée trouvée</p>
            )}
          </div>
        </div>
      </div>
  );
};

export default ByUser;
