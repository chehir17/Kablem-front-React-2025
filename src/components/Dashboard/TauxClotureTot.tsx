import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { useApiDebounce } from "../../hooks/useApiDebounce";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TauxClotureTot() {
  const [dataDoughnut, setDataDoughnut] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasData, setHasData] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const { executeDebouncedApi, cancel, error: apiError } = useApiDebounce(3000);

  const formatPercentage = (value: number) => {
    return parseFloat(value.toFixed(2));
  };

  useEffect(() => {
    const fetchactionDone = async () => {
      try {
        await executeDebouncedApi(
          async () => {
            setLoading(true);
            setError(false);
            
            const response = await axios.get('http://localhost:8000/api/actionDone', {
              timeout: 15000,
            });
            
            const DoneData = response.data;

            if (!DoneData || !Array.isArray(DoneData) || DoneData.length === 0 ||
              DoneData.every(item => item === 0 || item === null || item === undefined)) {
              setHasData(false);
              setDataDoughnut(null);
              return DoneData;
            }

            setHasData(true);

            const done = DoneData[0] || 0;
            const pending = 100 - done;

            if (isNaN(done) || isNaN(pending)) {
              setHasData(false);
              setDataDoughnut(null);
              return DoneData;
            }

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
            
            return DoneData;
          },
          {
            onError: (error) => {
              console.error("Erreur dans le hook:", error);
              setError(true);
              setHasData(false);
              setDataDoughnut(null);
            },
            maxRetries: 2,
            retryDelay: 10000
          }
        );
      } catch (error) {
        console.error("Erreur lors de l'exécution:", error);
        setError(true);
        setHasData(false);
        setDataDoughnut(null);
      } finally {
        setLoading(false);
      }
    };

    fetchactionDone();

    return () => {
      cancel();
    };
  }, [executeDebouncedApi, cancel]);

  useEffect(() => {
    if (apiError) {
      console.log("Erreur API détectée:", apiError);
    }
  }, [apiError]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-300 rounded mb-4"></div>
          <div className="h-80 w-80 items-center bg-gray-300 rounded-full mx-auto"></div>
          <div className="mt-5">
            <div className="h-5 bg-gray-300 rounded mb-2"></div>
            <div className="h-5 bg-gray-300 rounded mb-2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hasData || !dataDoughnut) {
    return (
      <div className="card rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-200">
            Taux de clôture des actions
          </h3>
        </div>

        <div className="h-80 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 mb-4 text-gray-400">
              {error ? (
                <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              ) : (
                <svg fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              )}
            </div>
            <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
              {error ? "Erreur de chargement" : "No data to display"}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {error
                ? apiError || "Impossible de charger les données pour le moment"
                : "Aucune donnée disponible pour le moment"
              }
            </p>
            {error && (
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Réessayer
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card rounded-2xl border border-gray-200 bg-white p-7 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="card-title text-lg font-semibold mb-4 text-gray-600 dark:text-gray-200">
        Taux de clôture des actions
      </div>

      <div className="w-85 h-85 mx-auto">
        {
          dataDoughnut && (
            <Doughnut
              data={dataDoughnut}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context: any) {
                        return `${context.label}: ${formatPercentage(context.parsed)}%`;
                      }
                    }
                  }
                }
              }}
            />
          )
        }
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