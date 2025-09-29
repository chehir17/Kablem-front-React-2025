import CountUp from "react-countup";
import { ArrowUpIcon, ArrowDownIcon, Money } from "../../../icons";
import Badge from "../../ui/badge/Badge";

export default function ScrapCost() {

  const scrapData = [
    { id: 1, cout_final: 1200 },
    { id: 2, cout_final: 800 },
    { id: 3, cout_final: 450 },
    { id: 4, cout_final: 600 },
  ];

  const previousCost = 2500;

  // Calcul du coût total scrap actuel
  const totalCost = scrapData.reduce(
    (sum, item) => sum + Number(item.cout_final || 0),
    0
  );

  // Variation en %
  const variation =
    previousCost > 0 ? ((totalCost - previousCost) / previousCost) * 100 : 0;

  const isIncrease = variation > 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-md">

      <div className="flex items-center justify-center w-12 h-12 bg-red-200 rounded-xl shadow-lg">
        <Money className="text-gray-800 size-8 dark:text-white/90" />
      </div>


      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Coût total du scrap (€ par Mois)
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            <CountUp
              end={totalCost}
              duration={2}
              separator=" "
              decimals={2}
              decimal=","
              suffix=" €"
            />
          </h4>
        </div>


        <Badge color={isIncrease ? "error" : "success"} variant="light">
          {isIncrease ? <ArrowUpIcon /> : <ArrowDownIcon />}
          {variation.toFixed(1)}%
        </Badge>
      </div>
    </div>
  );
}
