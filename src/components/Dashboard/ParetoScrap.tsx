import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ScrapRecord = {
  id: number;
  classification_cause: string | null;
  qnt_scrap: string | number | null;

};

type ParetoScrapProps = {
  data?: ScrapRecord[];
  height?: number;
};

function computePareto(records: ScrapRecord[]) {
  // Agglomérer par classification_cause en sommant qnt_scrap
  const map = new Map<string, number>();
  records.forEach((r) => {
    const key = (r.classification_cause ?? "Non classé").trim() || "Non classé";
    const q = Number(r.qnt_scrap ?? 0) || 0;
    map.set(key, (map.get(key) ?? 0) + q);
  });

  // Convertir en tableau et trier décroissant
  const arr = Array.from(map.entries()).map(([cause, qty]) => ({ cause, qty }));
  arr.sort((a, b) => b.qty - a.qty);

  const total = arr.reduce((s, it) => s + it.qty, 0) || 1;

  // Calculer cumul et pourcentage cumulatif
  let cumulative = 0;
  const labels: string[] = [];
  const quantities: number[] = [];
  const cumulativePct: number[] = [];

  arr.forEach((it) => {
    cumulative += it.qty;
    labels.push(it.cause);
    quantities.push(it.qty);
    cumulativePct.push((cumulative / total) * 100);
  });

  return { labels, quantities, cumulativePct, total };
}

export default function ParetoScrap({ data, height = 380 }: ParetoScrapProps) {

  const dummy: ScrapRecord[] = [
    { id: 1, classification_cause: "Mauvais réglage", qnt_scrap: 120 },
    { id: 2, classification_cause: "Fournisseur", qnt_scrap: 90 },
    { id: 3, classification_cause: "Usure outil", qnt_scrap: 60 },
    { id: 4, classification_cause: "Erreur opérateur", qnt_scrap: 40 },
    { id: 5, classification_cause: "Matière première", qnt_scrap: 30 },
    { id: 6, classification_cause: "Contrôle manquant", qnt_scrap: 20 },
    { id: 7, classification_cause: null, qnt_scrap: 10 },
  ];

  const source = data && data.length ? data : dummy;

  const { labels, quantities, cumulativePct } = useMemo(
    () => computePareto(source),
    [source]
  );

  const chartData = {
    labels,
    datasets: [
      {
        type: "bar" as const,
        label: "Quantité scrap",
        data: quantities,
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        yAxisID: "y",
      },
      {
        type: "line" as const,
        label: "Cumulatif (%)",
        data: cumulativePct,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.25,
        fill: false,
        yAxisID: "y1",
        pointRadius: 4,
      },

      {
        type: "line" as const,
        label: "Seuil 80%",
        data: labels.map(() => 80),
        borderColor: "rgba(0,0,0,0.5)",
        borderDash: [6, 6],
        pointRadius: 0,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Pareto 80/20 — Causes du scrap" },
      tooltip: {
        callbacks: {

          label: function (context: any) {
            const dsLabel = context.dataset.label || "";
            const val = context.parsed?.y ?? context.parsed ?? context.raw;
            if (dsLabel === "Cumulatif (%)" || dsLabel === "Seuil 80%") {
              return `${dsLabel}: ${Number(val).toFixed(1)}%`;
            }
            return `${dsLabel}: ${val}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { maxRotation: 45, minRotation: 0 },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: { display: true, text: "Quantité scrap" },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        min: 0,
        max: 100,
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Cumulatif (%)" },
        ticks: {
          callback: function (value: any) {
            return value + "%";
          },
        },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-200">Causes du scrap</h3>
        <div className="text-sm text-gray-500 dark:text-gray-200">Identifier les 20% responsables de 80%</div>
      </div>

      <div style={{ height }}>
        <Chart type="bar" data={chartData} options={options} />
      </div>

      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        <strong>Interprétation :</strong> la courbe cumulée montre la part cumulée de la
        quantité de scrap. Les causes en début d'axe X (gauche) sont celles à traiter en priorité
        (80/20).
      </div>
    </div>
  );
}
