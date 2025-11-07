import { useState, useEffect } from "react";
import CountUp from "react-countup";
import { Rapport, ArrowUpIcon, ArrowDownIcon, UserIcon,Package, PieChartIcon } from "../../../icons";
import Badge from "../../ui/badge/Badge";
import axios from "axios";
import { useApiDebounce } from "../../../hooks/useApiDebounce";

const RapportNcService = {
  getMonthlyStats: async () => {
    const response = await axios.get('http://localhost:8000/api/monthly-stats-nc',{
      timeout:10000,
    });
    if (!response.data) {
      throw new Error('Erreur lors de la récupération des statistiques NC');
    }
    return response.data;
  }
};

export default function CountRapportNC() {
  const [rapportNcData, setRapportNcData] = useState({

    currentMonthCount: 0,
    previousMonthCount: 0,
    countVariation: 0,
    isCountIncrease: false,
    
    currentTotalQteNc: 0,
    previousTotalQteNc: 0,
    qteVariation: 0,
    isQteIncrease: false,
    
    currentAvgQteNc: 0,
    previousAvgQteNc: 0,
    currentMinQteNc: 0,
    currentMaxQteNc: 0,
    
    currentUniqueClients: 0,
    previousUniqueClients: 0,
    currentUniqueArticles: 0,
    previousUniqueArticles: 0,
    
    month: '',
    previousMonth: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { executeDebouncedApi, cancel } = useApiDebounce(10000);

  useEffect(() => {
    const fetchRapportNcData = async () => {
      await executeDebouncedApi(
        async () => {
          try {
            setLoading(true);
            const data = await RapportNcService.getMonthlyStats();
            setRapportNcData({
              currentMonthCount: data.current_month_count,
              previousMonthCount: data.previous_month_count,
              countVariation: data.count_variation,
              isCountIncrease: data.is_count_increase,
              
              currentTotalQteNc: data.current_total_qte_nc,
              previousTotalQteNc: data.previous_total_qte_nc,
              qteVariation: data.qte_variation,
              isQteIncrease: data.is_qte_increase,
              
              currentAvgQteNc: data.current_avg_qte_nc,
              previousAvgQteNc: data.previous_avg_qte_nc,
              currentMinQteNc: data.current_min_qte_nc,
              currentMaxQteNc: data.current_max_qte_nc,
              
              currentUniqueClients: data.current_unique_clients,
              previousUniqueClients: data.previous_unique_clients,
              currentUniqueArticles: data.current_unique_articles,
              previousUniqueArticles: data.previous_unique_articles,
              
              month: data.month,
              previousMonth: data.previous_month
            });
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
            console.error('Erreur:', err);
          } finally {
            setLoading(false);
          }
        }
      );
    };

    fetchRapportNcData();

    return () => {
      cancel();
    };
  }, [executeDebouncedApi, cancel]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-md">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-blue-200 rounded-xl"></div>
          <div className="mt-5 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-md">
        <div className="text-center text-red-600">
          Erreur: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-200 rounded-xl shadow-lg">
          <Rapport className="size-8 text-gray-800 dark:text-white" />
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {showDetails ? 'Masquer détails' : 'Voir détails'}
        </button>
      </div>

      <div className="flex items-end justify-between mt-5">
        <div className="flex-1">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Rapports Non-Conformité ({rapportNcData.month})
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            <CountUp end={rapportNcData.currentMonthCount} duration={2} />
          </h4>
          

          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-500">
              vs {rapportNcData.previousMonth}: {rapportNcData.previousMonthCount}
            </p>
            <p className="text-xs text-gray-500">
              Quantité NC: <CountUp end={rapportNcData.currentTotalQteNc} duration={2} separator=" " />
            </p>
          </div>


          {showDetails && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">Quantité moyenne/NC:</span>
                <span className="font-medium dark:text-white/60">{rapportNcData.currentAvgQteNc.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">Plage quantité:</span>
                <span className="font-medium dark:text-white/60">
                  {rapportNcData.currentMinQteNc} - {rapportNcData.currentMaxQteNc}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <UserIcon className="size-3" />
                  Clients concernés:
                </span>
                <span className="font-medium dark:text-white/60">{rapportNcData.currentUniqueClients}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Package className="size-3" />
                  Articles concernés:
                </span>
                <span className="font-medium dark:text-white/60">{rapportNcData.currentUniqueArticles}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <PieChartIcon className="size-3" />
                  Variation quantité:
                </span>
                <Badge
                  className={rapportNcData.isQteIncrease ? "text-red-600" : "text-green-600"}
                  color={rapportNcData.isQteIncrease ? "error" : "success"}
                  size="sm"
                >
                  {rapportNcData.isQteIncrease ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  {rapportNcData.qteVariation}%
                </Badge>
              </div>
            </div>
          )}
        </div>

        <div className="ml-4">
          <Badge
            className={rapportNcData.isCountIncrease ? "text-red-600" : "text-green-600"}
            color={rapportNcData.isCountIncrease ? "error" : "success"}
          >
            {rapportNcData.isCountIncrease ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {rapportNcData.countVariation}%
          </Badge>
        </div>
      </div>
    </div>
  );
}