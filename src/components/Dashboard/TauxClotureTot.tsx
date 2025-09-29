import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(ArcElement, Tooltip, Legend);

export default function TauxClotureTot() {
  const [dataDoughnut, setDataDoughnut] = useState<any>(null);

  useEffect(() => {
    const dummyAction = {
      done: 65,     // Actions clôturées
      pending: 35,  // Actions en attente
    };

    setDataDoughnut({
      labels: [
        `Done ${dummyAction.done}%`,
        `En attente ${dummyAction.pending}%`,
      ],
      datasets: [
        {
          data: [dummyAction.done, dummyAction.pending],
          backgroundColor: ["#46BFBD", "#fe7c96"],
          hoverBackgroundColor: ["#1bcfb4", "#f06292"],
          borderWidth: 1,
        },
      ],
    });
  }, []);

  if (!dataDoughnut)
    return (
      <p className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03]">
        Chargement du graphique...
      </p>
    );

  return (
    <div className="card rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="card-title text-lg font-semibold mb-4 text-gray-600 dark:text-gray-200">
        Taux de clôture des actions
      </div>

      <div className="w-70 h-65 mx-auto">
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

      <div className="pt-4">
        <ul className="space-y-2">
          <li className="flex items-center justify-between dark:text-gray-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              Actions Done
            </div>
            <span>{dataDoughnut.datasets[0].data[0]}%</span>
          </li>
          <li className="flex items-center justify-between dark:text-gray-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
              Actions en attente
            </div>
            <span>{dataDoughnut.datasets[0].data[1]}%</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
