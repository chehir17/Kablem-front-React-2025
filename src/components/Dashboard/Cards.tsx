import {
  ArrowDownIcon,
  ArrowUpIcon,
  Scrap,
} from "../../icons";
import MachineCount from "./Cards/MachineCount";
import ScrapCount from "./Cards/ScrapCount";
import ScrapCost from "./Cards/ScrapCout";
import Badge from "../ui/badge/Badge";
import CountUp from "react-countup";

export default function Cards() {
  // Exemple de données scrap (à remplacer par ton API)
  const scrapData = [
    { id: 1, qnt_scrap: 20 },
    { id: 2, qnt_scrap: 15 },
    { id: 3, qnt_scrap: 8 },
    { id: 4, qnt_scrap: 12 },
  ];

  // Valeur précédente (exemple fixe, tu pourras remplacer par ton API)
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
      {/* <!-- Metric Item Start --> */}
      <ScrapCount />
      <ScrapCost />
      <MachineCount />
    </div>
  );
}