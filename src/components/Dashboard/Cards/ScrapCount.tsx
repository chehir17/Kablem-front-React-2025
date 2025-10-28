import { useState, useEffect } from "react";
import CountUp from "react-countup";
import { Scrap, ArrowUpIcon, ArrowDownIcon } from "../../../icons";
import Badge from "../../ui/badge/Badge";
import axios from "axios";
import { useApiDebounce } from "../../../hooks/useApiDebounce";

const ScrapService = {
  getMonthlyStats: async () => {
    const response = await axios.get('http://localhost:8000/api/monthly-stats');
    if (!response.data) {
      throw new Error('Erreur lors de la récupération des données scrap');
    }
    return response.data;
  }
};

export default function ScrapCount() {
  const [scrapData, setScrapData] = useState({
    currentMonthScrap: 0,
    previousMonthScrap: 0,
    variation: 0,
    isIncrease: false,
    month: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { executeDebouncedApi, cancel } = useApiDebounce(500);

  useEffect(() => {
    const fetchScrapData = async () => {
      await executeDebouncedApi(
        async () => {
          try {
            setLoading(true);
            const data = await ScrapService.getMonthlyStats();
            setScrapData({
              currentMonthScrap: data.current_month_scrap,
              previousMonthScrap: data.previous_month_scrap,
              variation: data.variation,
              isIncrease: data.is_increase,
              month: data.month
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

    fetchScrapData();

    return () => {
      cancel();
    };
  }, [executeDebouncedApi, cancel]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-md">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
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
      <div className="flex items-center justify-center w-12 h-12 bg-green-200 rounded-xl shadow-lg">
        <Scrap className="size-8 text-gray-800 dark:text-white" />
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Registres Scrap ({scrapData.month})
          </span>
          <h4 className="mt-3 font-bold text-gray-800 text-title-sm dark:text-white/90">
            <CountUp end={scrapData.currentMonthScrap} duration={2} />
          </h4>
          <p className="text-xs text-gray-500 mt-3">
            Mois précédent: {scrapData.previousMonthScrap}
          </p>
        </div>
        <Badge 
          className={scrapData.isIncrease ? "text-red-600" : "text-green-600"} 
          color={scrapData.isIncrease ? "error" : "success"}
        >
          {scrapData.isIncrease ? <ArrowUpIcon /> : <ArrowDownIcon />}
          {scrapData.variation}%
        </Badge>
      </div>
    </div>
  );
}