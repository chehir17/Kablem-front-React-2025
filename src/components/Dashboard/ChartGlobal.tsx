import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import DataTableLayout from "../../layout/DataTableLayout";
import { Modal } from "../ui/modal";


export default function GlobalChart() {

    const [series, setSeries] = useState<any[]>([]);
    const [options, setOptions] = useState<any>({});
    const [selectedDept, setSelectedDept] = useState<string | null>(null);
    const [details, setDetails] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    // const [isDark, setIsDark] = useState(false);

    const handleClose = () => setIsOpen(false);

    const departments = [
        "Qualité",
        "Maintenance",
        "Production",
        "Indust",
        "Logistique",
        "Comptabilité & Finance",
        "RH",
        "Achat",
    ];

    // Dummy data
    const dummyNotDone: Record<string, any[]> = {
        Qualité: [
            {
                id_planaction: 101,
                status: "En attente",
                progress: 20,
                departement: "Qualité",
                zone: "Zone A",
                origine: "Audit",
                prob: "Non-conformité détectée",
                cause: "Mauvais process",
                action: "Former les employés",
                date_debut: "2025-09-01",
                date_cloture: "2025-09-15",
                first_name: "Ali",
                last_name: "Ben Salah",
            },
        ],
        Maintenance: [
            {
                id_planaction: 102,
                status: "En cours",
                progress: 50,
                departement: "Maintenance",
                zone: "Atelier 1",
                origine: "Incident machine",
                prob: "Panne moteur",
                cause: "Manque entretien",
                action: "Changer les filtres",
                date_debut: "2025-08-15",
                date_cloture: "2025-09-20",
                first_name: "Sami",
                last_name: "Trabelsi",
            },
        ],
    };

    const dummyDone: Record<string, any[]> = {
        Qualité: [{ id: 1 }, { id: 2 }, { id: 3 }],
        Maintenance: [{ id: 4 }],
        Production: [{ id: 5 }, { id: 6 }],
        Indust: [],
        Logistique: [{ id: 7 }, { id: 8 }],
        "Comptabilité & Finance": [{ id: 9 }],
        RH: [{ id: 10 }],
        Achat: [{ id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }],
    };


    useEffect(() => {
        setSeries([
            {
                name: "done",
                data: departments.map((d) => dummyDone[d]?.length || 0),
            },
            {
                name: "not done",
                data: departments.map((d) => dummyNotDone[d]?.length || 0),
            },
        ]);

        setOptions({
            colors: ["#0094cc", "#eed202"],
            chart: { type: "bar", height: 350, stacked: true },
            plotOptions: { bar: { horizontal: true } },
            stroke: { width: 1, colors: ["#fff"] },
            xaxis: {
                categories: departments,
                labels: { formatter: (val: string) => Math.round(Number(val)) },
            },
            legend: { position: "top", horizontalAlign: "left" },
            fill: { opacity: 1 },
        });
    }, []);

    const handleOpenDept = (dept: string) => {
        setSelectedDept(dept);
        setDetails(dummyNotDone[dept] || []);
        setIsOpen(true);
    };


    const columns = [
        { name: "ID", selector: (row: any) => row.id_planaction, sortable: true },
        { name: "Statut", selector: (row: any) => row.status, sortable: true },
        { name: "Progression", selector: (row: any) => `${row.progress}%`, sortable: true },
        { name: "Département", selector: (row: any) => row.departement },
        { name: "Zone", selector: (row: any) => row.zone },
        { name: "Origine", selector: (row: any) => row.origine },
        { name: "Problème", selector: (row: any) => row.prob },
        { name: "Cause", selector: (row: any) => row.cause },
        { name: "Action", selector: (row: any) => row.action },
        { name: "Date Début", selector: (row: any) => row.date_debut },
        { name: "Date Clôture", selector: (row: any) => row.date_cloture },
        { name: "Responsable", selector: (row: any) => `${row.first_name} ${row.last_name}` },
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="card-body">
                <div className="flex">
                    <div className="flex-1">
                        <h3 className="text-md font-semibold text-gray-600 dark:text-gray-200 mb-4">
                            Total statut des actions par département
                        </h3>
                        <ReactApexChart options={options} series={series} type="bar" height={350} />
                    </div>
                    <div className="flex flex-col justify-center mt-12">
                        {departments.map((dept) => (
                            <button
                                key={dept}
                                className="mb-2 bg-sky-600 hover:bg-sky-800 text-white"
                                onClick={() => handleOpenDept(dept)}
                            >
                                ➡
                            </button>
                        ))}
                    </div>
                </div>

                <Modal
                    isOpen={isOpen}
                    onClose={handleClose}
                    className="max-w-[1000px] mt-20"
                >
                    <div className="no-scrollbar relative w-full max-w-[1000px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                        <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90 text-gray-600">
                            Liste des actions - {selectedDept}
                        </h4>

                        <DataTableLayout
                            title=""
                            columns={columns}
                            data={details}
                        />
                    </div>
                </Modal>

            </div>
        </div>
    );
};

