import { useState, useEffect } from "react";
import CountUp from "react-countup";
import { ArrowUpIcon, ArrowDownIcon, Money } from "../../../icons";
import Badge from "../../ui/badge/Badge";
import axios from "axios";
import { useApiDebounce } from "../../../hooks/useApiDebounce";

const ScrapService = {
  getMonthlyCost: async () => {
    const response = await axios.get('http://localhost:8000/api/monthly-cost',{
      timeout:10000,
    });
    if (!response.data) {
      throw new Error('Erreur lors de la récupération du coût scrap');
    }
    return response.data;
  }
};

export default function ScrapCost() {
  const [scrapCostData, setScrapCostData] = useState({
    currentMonthCost: 0,
    previousMonthCost: 0,
    variation: 0,
    isIncrease: false,
    month: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { executeDebouncedApi, cancel } = useApiDebounce(10000);

  useEffect(() => {
    const fetchScrapCostData = async () => {
      await executeDebouncedApi(
        async () => {
          try {
            setLoading(true);
            const data = await ScrapService.getMonthlyCost();
            setScrapCostData({
              currentMonthCost: data.current_month_cost,
              previousMonthCost: data.previous_month_cost,
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

    fetchScrapCostData();

    return () => {
      cancel();
    };
  }, [executeDebouncedApi, cancel]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-md">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-red-200 rounded-xl"></div>
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
      <div className="flex items-center justify-center w-12 h-12 bg-red-200 rounded-xl shadow-lg">
        <Money className="text-gray-800 size-8 dark:text-white/90" />
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Coût total du scrap ({scrapCostData.month})
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            <CountUp
              end={scrapCostData.currentMonthCost}
              duration={2}
              separator=" "
              decimals={2}
              decimal=","
              suffix=" €"
            />
          </h4>
          <p className="text-xs text-gray-500 mt-3">
            Mois précédent: {scrapCostData.previousMonthCost.toFixed(2)} €
          </p>
        </div>

        <Badge 
          className={scrapCostData.isIncrease ? "text-red-600" : "text-green-600"} 
          color={scrapCostData.isIncrease ? "error" : "success"}
        >
          {scrapCostData.isIncrease ? <ArrowUpIcon /> : <ArrowDownIcon />}
          {scrapCostData.variation}%
        </Badge>
      </div>
    </div>
  );
}