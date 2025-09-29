import { JSX, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import DataTableLayout from "../../layout/DataTableLayout";
import { useNavigate } from "react-router";
import EditLigneModal from "../../components/Ligne/EditLigneModel";
import { Update } from "../../icons";
import { Trash } from "../../icons";

interface Ligne {
    id: number;
    nom_ligne: string;
    ref_ligne: string;
    departement: string;
    Capacite_production: number;
    Resp_ligne: string,
    Date_maintenance: Date,
    proch_entretien: Date,
    status: string,
}

const tableData: Ligne[] = [
    {
        id: 1,
        nom_ligne: "Ligne A",
        ref_ligne: "REF123",
        departement: "Département A",
        Capacite_production: 1000,
        Resp_ligne: "Responsable A",
        Date_maintenance: new Date("2025-09-15"),
        proch_entretien: new Date("2025-12-20"),
        status: "Actif",
    },
    {
        id: 2,
        nom_ligne: "Ligne B",
        ref_ligne: "REF456",
        departement: "Département B",
        Capacite_production: 2000,
        Resp_ligne: "Responsable B",
        Date_maintenance: new Date("2025-10-20"),
        proch_entretien: new Date("2025-11-23"),
        status: "Inactif",
    },
];

interface Column<T> {
    name: string;
    selector?: (row: T) => string | number;
    sortable?: boolean;
    cell?: (row: T) => JSX.Element;
}


export default function Lignes() {
    const [lignes, setLignes] = useState<Ligne[]>(tableData);
    const [selectedLigne, setSelectedLigne] = useState<Ligne | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const columns: Column<Ligne>[] = [
        {
            name: "Nom de la Ligne",
            selector: (row) => row.nom_ligne,
            sortable: true,
        },
        {
            name: "Référence Ligne",
            selector: (row) => row.ref_ligne,
            sortable: true,
        },
        {
            name: "Département",
            selector: (row) => row.departement,
            sortable: true,
        },
        {
            name: "Capacité de Production",
            selector: (row) => row.Capacite_production + " (Pcs)",
            sortable: true,
        },
        {
            name: "Responsable de la Ligne",
            selector: (row) => row.Resp_ligne,
            sortable: true,
        },
        {
            name: "Derniere Maintenance",
            selector: (row) => row.Date_maintenance.toLocaleDateString(),
            sortable: true,
        },
        {
            name: "Prochaine maintenance",
            selector: (row) => row.proch_entretien.toLocaleDateString(),
            sortable: true,
        },
        {
            name: "Statut",
            selector: (row) => row.status,
            sortable: true,
            cell: (row) => (
                <Badge
                    color={
                        row.status === "Actif"
                            ? "success"
                            : row.status === "Inactif"
                                ? "warning"
                                : "error"
                    }
                    variant="light"
                >
                    {row.status}
                </Badge>
            ),
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                        <Update className="w-6 h-6 font-bold" />
                    </button>
                    <button
                        onClick={() => alert(`Supprimer fournisseur ID: ${row.id}`)}
                        className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                    >
                        <Trash className="w-5 h-5 font-bold" />
                    </button>
                </div>
            ),
        },
    ];

    const handleEdit = (row: Ligne) => {
        setSelectedLigne(row);
        setIsModalOpen(true);
    };

    const handleSave = (updatedLigne: Ligne) => {
        setLignes((prev) =>
            prev.map((a) => (a.id === updatedLigne.id ? updatedLigne : a))
        );
    };

    return (
        <>
            <div>
                <PageMeta
                    title="Lignes"
                    description="page de gestion des lignes"
                />
                <PageBreadcrumb pageTitle="Lignes" />
                <button
                    onClick={() => navigate("/lignes/ajouter-ligne")}
                    className="px-3 py-3 my-3 text-xs text-white bg-blue-500 rounded hover:bg-blue-700 hover:shadow-xl transition-shadow duration-200"
                >
                    Ajouter une Ligne
                </button>
                <div className="grid grid-cols-1 gap-6 ">

                    <DataTableLayout
                        title="Liste des Lignes"
                        columns={columns}
                        data={lignes}
                    />
                    <EditLigneModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        ligne={selectedLigne}
                        onSave={handleSave}
                    />
                </div>
            </div>
        </>
    );
}
