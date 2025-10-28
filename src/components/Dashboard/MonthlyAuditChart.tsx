import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function MonthlyAuditChart() {
  const [audits, setAudits] = useState({
    suiviclients: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    supercontroles: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    suivifournisseurs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  });

  const [selectedAudit, setSelectedAudit] = useState<keyof typeof audits>("suiviclients");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const requestTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedFetch = (fetchFunction: () => void, delay: number) => {
    if (requestTimeoutRef.current) {
      clearTimeout(requestTimeoutRef.current);
    }
    requestTimeoutRef.current = setTimeout(fetchFunction, delay);
  };

  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/audits/available-years');
        if (response.data.success) {
          setAvailableYears(response.data.years);
          if (response.data.years.length > 0 && !response.data.years.includes(selectedYear)) {
            setSelectedYear(response.data.years[0]);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des années:", error);
        setAvailableYears([new Date().getFullYear()]);
      }
    };

    fetchAvailableYears();
  }, []);


  const fetchAuditData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/audits/monthly', {
        params: {
          year: selectedYear
        }
      });

      if (response.data.success) {
        const data = response.data.data;

        const convertToArray = (monthData: any) => {
          const result = [];
          for (let month = 1; month <= 12; month++) {
            result.push(monthData[month] || 0);
          }
          return result;
        };

        setAudits({
          suiviclients: convertToArray(data.suiviclients),
          supercontroles: convertToArray(data.supercontroles),
          suivifournisseurs: convertToArray(data.suivifournisseurs),
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données d'audit:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    debouncedFetch(fetchAuditData, 500);

    return () => {
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
      }
    };
  }, [selectedYear]);


  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories: [
        "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
        "Juil", "Août", "Sep", "Oct", "Nov", "Déc",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    grid: {
      yaxis: { lines: { show: true } },
    },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: false },
      y: { formatter: (val: number) => `${val} audits` },
    },
  };

  const series = [
    {
      name: getAuditLabel(selectedAudit),
      data: audits[selectedAudit],
    },
  ];

  function getAuditLabel(auditType: string): string {
    const labels = {
      suiviclients: "Suivi Client",
      supercontroles: "Super Contrôle",
      suivifournisseurs: "Suivi Fournisseur"
    };
    return labels[auditType as keyof typeof labels] || auditType;
  }

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-40 bg-gray-300 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {`Nombre de ${getAuditLabel(selectedAudit)} par mois - ${selectedYear}`}
        </h3>

        <div className="flex items-center gap-2">
          {/* Sélecteur d'année */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:text-gray-200"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {/* Dropdown pour le type d'audit */}
          <div className="relative inline-block">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-48 p-2">
              {Object.keys(audits).map((audit) => (
                <DropdownItem
                  key={audit}
                  onItemClick={() => {
                    setSelectedAudit(audit as keyof typeof audits);
                    closeDropdown();
                  }}
                  className="flex w-full font-normal text-left text-gray-500 rounded-lg 
                             hover:bg-gray-100 hover:text-gray-700 
                             dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  {getAuditLabel(audit)}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}