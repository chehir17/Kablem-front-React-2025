
import ScrapCount from "./Cards/ScrapCount";
import ScrapCost from "./Cards/ScrapCout";
import CountRapportNC from "./Cards/CountRapportNC";

export default function Cards() {

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
      <ScrapCount />
      <ScrapCost />
      <CountRapportNC />
    </div>
  );
}