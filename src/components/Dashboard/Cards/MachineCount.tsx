import CountUp from "react-countup";
import { MachineIcon, ArrowUpIcon, ArrowDownIcon } from "../../../icons";
import Badge from "../../ui/badge/Badge";

export default function MachineCount() {
  const machineData = [
    { id: 1, status: "active" },
    { id: 2, status: "inactive" },
    { id: 3, status: "active" },
    { id: 4, status: "active" },
    { id: 5, status: "active" },
    { id: 6, status: "active" },
    { id: 7, status: "active" },
    { id: 8, status: "active" },
    { id: 9, status: "active" },
    { id: 10, status: "active" },
    { id: 11, status: "inactive" },
    { id: 12, status: "active" },
    { id: 13, status: "active" },
    { id: 14, status: "inactive" },
    { id: 15, status: "active" },
    { id: 16, status: "inactive" },
    { id: 17, status: "inactive" },
    { id: 18, status: "inactive" },
    { id: 19, status: "inactive" },
  ];

  const previousActive = 2;

  const activeMachines = machineData.filter((m) => m.status === "active").length;

  const variation =
    previousActive > 0
      ? ((activeMachines - previousActive) / previousActive) * 100
      : 0;

  const isIncrease = variation > 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-md">

      <div className="flex items-center justify-center w-12 h-12 bg-blue-200 rounded-xl shadow-lg">
        <MachineIcon className="size-8 text-gray-800 dark:text-white" />
      </div>


      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Machines actives
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            <CountUp end={activeMachines} duration={2} />
          </h4>
        </div>

        <Badge
          className={isIncrease ? "text-green-600" : "text-red-600"}
          color={isIncrease ? "success" : "error"}
        >
          {isIncrease ? <ArrowUpIcon /> : <ArrowDownIcon />}
          {variation.toFixed(1)}%
        </Badge>
      </div>
    </div>
  );
}
