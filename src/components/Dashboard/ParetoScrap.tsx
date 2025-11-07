import { useMemo, useState, useEffect } from "react";
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
import axios from "axios";
import { useApiDebounce } from "../../hooks/useApiDebounce";

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
  occurrence_count?: number;
};

type ParetoScrapProps = {
  data?: ScrapRecord[];
  height?: number;
};

function computePareto(records: ScrapRecord[]) {
  // Si pas de records, retourner des données vides
  if (!records || records.length === 0) {
    return { labels: [], quantities: [], cumulativePct: [], total: 0 };
  }

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

const defaultDummyData: ScrapRecord[] = [
  { id: 1, classification_cause: "Mauvais réglage", qnt_scrap: 120 },
  { id: 2, classification_cause: "Fournisseur", qnt_scrap: 90 },
  { id: 3, classification_cause: "Usure outil", qnt_scrap: 60 },
  { id: 4, classification_cause: "Erreur opérateur", qnt_scrap: 40 },
  { id: 5, classification_cause: "Matière première", qnt_scrap: 30 },
  { id: 6, classification_cause: "Contrôle manquant", qnt_scrap: 20 },
  { id: 7, classification_cause: "Défaut machine", qnt_scrap: 15 },
];

export default function ParetoScrap({ data, height = 380 }: ParetoScrapProps) {
  const [apiData, setApiData] = useState<ScrapRecord[]>(defaultDummyData);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [hasData, setHasData] = useState(true);
  const [yearsLoading, setYearsLoading] = useState(false);

  const { executeDebouncedApi, loading, error, cancel } = useApiDebounce(15000);

  useEffect(() => {
    const fetchTopScrapCauses = async () => {
      try {
        await executeDebouncedApi(
          async () => {
            console.log('🔄 Chargement des causes du scrap...');
            const response = await axios.get('http://localhost:8000/api/scrap/causes/top', {
              params: { year: selectedYear },
              timeout: 15000,
            });

            if (response.data.success) {
              if (response.data.data && response.data.data.length > 0) {
                console.log('✅ Données scrap chargées avec succès');
                setApiData(response.data.data);
                setHasData(true);
              } else {
                console.log('ℹ️ Aucune donnée réelle, utilisation des données démo');
                setApiData(defaultDummyData);
                setHasData(false);
              }
              return response.data;
            } else {
              console.log('⚠️ Réponse API non réussie, utilisation des données démo');
              setApiData(defaultDummyData);
              setHasData(false);
              return { data: defaultDummyData, isDemo: true };
            }
          },
          {
            onError: (err) => {
              console.error("❌ Erreur API scrap:", err);
              console.log('🔄 Utilisation des données démo suite à une erreur');
              setApiData(defaultDummyData);
              setHasData(false);
            },
            maxRetries: 2,
            retryDelay: 8000
          }
        );
      } catch (error) {
        console.error("❌ Erreur lors de l'exécution:", error);
        setApiData(defaultDummyData);
        setHasData(false);
      }
    };

    fetchTopScrapCauses();

    return () => {
      cancel();
    };
  }, [selectedYear, executeDebouncedApi, cancel]);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        setYearsLoading(true);
        console.log('🔄 Chargement des années disponibles...');
        const response = await axios.get('http://localhost:8000/api/scrap/causes/years', {
          timeout: 15000,
        });
        
        if (response.data.success) {
          console.log('✅ Années chargées avec succès');
          setAvailableYears(response.data.years);
        } else {
          console.log('⚠️ Réponse années non réussie, utilisation année courante');
          setAvailableYears([new Date().getFullYear()]);
        }
      } catch (err) {
        console.error("❌ Erreur lors du chargement des années:", err);
        console.log('🔄 Utilisation année courante suite à erreur');
        setAvailableYears([new Date().getFullYear()]);
      } finally {
        setYearsLoading(false);
      }
    };

    fetchYears();
  }, []);

  const source: ScrapRecord[] = apiData;

  const { labels, quantities, cumulativePct } = useMemo(
    () => computePareto(source),
    [source]
  );

  const chartData = useMemo(() => {
    if (labels.length === 0) {
      const defaultData = computePareto(defaultDummyData);
      return {
        labels: defaultData.labels,
        datasets: [
          {
            type: "bar" as const,
            label: "Quantité scrap",
            data: defaultData.quantities,
            backgroundColor: "rgba(54, 162, 235, 0.8)",
            borderColor: "rgba(54, 162, 235, 1)",
            yAxisID: "y",
          },
          {
            type: "line" as const,
            label: "Cumulatif (%)",
            data: defaultData.cumulativePct,
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
            data: defaultData.labels.map(() => 80),
            borderColor: "rgba(0,0,0,0.5)",
            borderDash: [6, 6],
            pointRadius: 0,
            yAxisID: "y1",
          },
        ],
      };
    }

    return {
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
  }, [labels, quantities, cumulativePct]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: `Top 7 Causes du Scrap - ${selectedYear}${!hasData ? ' (Données démo)' : ''}`
      },
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
        beginAtZero: true,
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

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          Chargement des 7 causes principales du scrap {selectedYear}...
        </p>
        {error && (
          <p className="text-center text-sm text-yellow-600 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-200">
          Top 7 Causes du Scrap
        </h3>
        <div className="flex items-center gap-2">
          {yearsLoading ? (
            <div className="animate-pulse w-24 h-8 bg-gray-300 rounded"></div>
          ) : (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:text-gray-200"
              disabled={availableYears.length === 0}
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}
          <div className="text-sm text-gray-500 dark:text-gray-200">
            Analyse 80/20 des causes principales
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <strong>Information:</strong>
          </div>
          <p className="mt-1 ml-7">{error}</p>
        </div>
      )}

      {!hasData && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <strong>Note:</strong>
          </div>
          <p className="mt-1 ml-7">Affichage des données de démonstration (aucune donnée réelle pour {selectedYear})</p>
        </div>
      )}

      <div style={{ height }}>
        {chartData && chartData.labels && chartData.labels.length > 0 ? (
          <Chart type="bar" data={chartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-lg mb-2">Aucune donnée disponible</p>
              <p className="text-gray-400 text-sm">
                Impossible de charger les données du graphique Pareto
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        <strong>Interprétation :</strong> Affichage des 7 causes principales du scrap par quantité totale.
        Les causes en début de graphique représentent les plus importantes à traiter en priorité selon la méthode 80/20.
        {!hasData && " Données de démonstration utilisées."}
      </div>
    </div>
  );
}