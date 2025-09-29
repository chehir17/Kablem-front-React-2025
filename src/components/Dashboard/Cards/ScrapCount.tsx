
import CountUp from "react-countup";
import { Scrap, ArrowUpIcon, ArrowDownIcon } from "../../../icons";
import Badge from "../../ui/badge/Badge";

export default function ScrapCount() {

  const scrapData = [
    { id: 1, qnt_scrap: 20 },
    { id: 2, qnt_scrap: 15 },
    { id: 3, qnt_scrap: 8 },
    { id: 4, qnt_scrap: 12 },
  ];

  // Valeur précédente
  const previousScrap = 70;

  // Calcul du total scrap actuel
  const totalScrap = scrapData.reduce(
    (sum, item) => sum + Number(item.qnt_scrap || 0),
    0
  );

  // Variation en %
  const variation =
    previousScrap > 0
      ? ((totalScrap - previousScrap) / previousScrap) * 100
      : 0;

  const isIncrease = variation > 0;

  return (

    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-md">
      <div className="flex items-center justify-center w-12 h-12 bg-green-200 rounded-xl shadow-lg">
        <Scrap className="size-8 text-gray-800 dark:text-white" />
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Scrap total (Mois)
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            <CountUp end={totalScrap} duration={2} />
          </h4>
        </div>
        <Badge className={isIncrease ? "text-red-600" : "text-green-600"} color={isIncrease ? "error" : "success"}>
          {isIncrease ? <ArrowUpIcon /> : <ArrowDownIcon />}
          {variation.toFixed(1)}%
        </Badge>
      </div>
    </div>
  );
}
