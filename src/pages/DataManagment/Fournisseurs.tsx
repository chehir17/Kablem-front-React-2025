import { JSX, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import DataTableLayout from "../../layout/DataTableLayout";
import AddFournisseurForm from "../../components/Fournisseur/AddFournisseurForm";
import EditFournisseurModal from "../../components/Fournisseur/EditFournisseurModel";
import { Trash } from "../../icons";
import { Update } from "../../icons";

interface Fournisseur {
    id: number;
    nom_fournisseur: string;
    reference_fournisseur: string;
    classification: string;
    email: string,
    status: string,
}

const tableData: Fournisseur[] = [
    {
        id: 1,
        nom_fournisseur: "Fournisseur A",
        reference_fournisseur: "REF123",
        classification: "Classification A",
        email: "fournisseura@example.com",
        status: "Actif",
    },
    {
        id: 2,
        nom_fournisseur: "Fournisseur B",
        reference_fournisseur: "REF456",
        classification: "Classification B",
        email: "fournisseurb@example.com",
        status: "Inactif",
    },
];

interface Column<T> {
    name: string;
    selector?: (row: T) => string | number;
    sortable?: boolean;
    cell?: (row: T) => JSX.Element;
}


export default function Fournisseurs() {
    const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>(tableData);
    const [selectedFournisseur, setSelectedFournisseur] = useState<Fournisseur | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns: Column<Fournisseur>[] = [
        {
            name: "Nom du Fournisseur",
            selector: (row) => row.nom_fournisseur,
            sortable: true,
        },
        {
            name: "Référence Fournisseur",
            selector: (row) => row.reference_fournisseur,
            sortable: true,
        },
        {
            name: "Classification",
            selector: (row) => row.classification,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
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
                        <Trash className="w-5 h-5 font-bold"/>
                    </button>
                </div>
            ),
        },
    ];

    const handleEdit = (row: Fournisseur) => {
        setSelectedFournisseur(row);
        setIsModalOpen(true);
    };

    const handleSave = (updatedFournisseur: Fournisseur) => {
        setFournisseurs((prev) =>
            prev.map((a) => (a.id === updatedFournisseur.id ? updatedFournisseur : a))
        );
    };

    return (
        <>
            <div>
                <PageMeta
                    title="Fournisseurs"
                    description="page de gestion des fournisseurs"
                />
                <PageBreadcrumb pageTitle="Fournisseurs" />
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="space-y-6 xl:col-span-2">
                        <DataTableLayout
                            title="Liste des Fournisseurs"
                            columns={columns}
                            data={fournisseurs}
                        />
                        <EditFournisseurModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            fournisseur={selectedFournisseur}
                            onSave={handleSave}
                        />
                    </div>

                    <div className="space-y-6 xl:col-span-1">
                        <AddFournisseurForm />
                    </div>
                </div>
            </div>
        </>
    );
}
