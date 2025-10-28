import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";


ChartJS.register(ArcElement, Tooltip, Legend);

export default function TauxClotureTot() {
  const [dataDoughnut, setDataDoughnut] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const formatPercentage = (value: number) => {
    return parseFloat(value.toFixed(2));
  };

  useEffect(() => {
    const fetchactionDone = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/actionDone');
        const DoneData = response.data;

        const pending = 100 - DoneData;
        const done = DoneData;


        setDataDoughnut({
          labels: [
            `Done ${formatPercentage(done)}%`,
            `En attente ${formatPercentage(pending)}%`,
          ],
          datasets: [
            {
              data: [done, pending],
              backgroundColor: ["#46BFBD", "#fe7c96"],
              hoverBackgroundColor: ["#1bcfb4", "#f06292"],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      } finally {
        setLoading(false);
      }
    }
    fetchactionDone();
  }, []);

  if (!dataDoughnut)
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-300 rounded mb-4"></div>
          <div className="h-80 w-80 items-center bg-gray-300 rounded-full"></div>
          <div className="mt-5">
            <div className="h-5 bg-gray-300 rounded mb-2"></div>
            <div className="h-5 bg-gray-300 rounded mb-2"></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="card rounded-2xl border border-gray-200 bg-white p-7 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="card-title text-lg font-semibold mb-4 text-gray-600 dark:text-gray-200">
        Taux de clôture des actions
      </div>

      <div className="w-85 h-85 mx-auto">
        <Doughnut
          data={dataDoughnut}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
          width={250}
          height={250}
        />
      </div>

      <div className="pt-6">
        <ul className="space-y-2">
          <li className="flex items-center justify-between dark:text-gray-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              Actions Done
            </div>
            <span>{formatPercentage(dataDoughnut.datasets[0].data[0])}%</span>
          </li>
          <li className="flex items-center justify-between dark:text-gray-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
              Actions en attente
            </div>
            <span>{formatPercentage(dataDoughnut.datasets[0].data[1])}%</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
