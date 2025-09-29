import { JSX, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTableLayout from "../../layout/DataTableLayout";
import { useNavigate } from "react-router";
import EditPieceLivreModal from "../../components/PieceLivre/EditPieceLivreForm";
import { Update } from "../../icons";
import { Trash } from "../../icons";


interface PiecesLivre {
    id: number;
    pcs_client: string;
    pcs_p1_p2: string;
    pcs_p3: string;
    pcs_fournisseur: string;
    pcs_month: Date,
}

const tableData: PiecesLivre[] = [
    {
        id: 1,
        pcs_client: "Client A",
        pcs_p1_p2: "REF123",
        pcs_p3: "P3255",
        pcs_fournisseur: "Fournisseur A",
        pcs_month: new Date("2025-10-20"),
    },
    {
        id: 2,
        pcs_client: "Client B",
        pcs_p1_p2: "REF588",
        pcs_p3: "P36885",
        pcs_fournisseur: "Fournisseur N",
        pcs_month: new Date("2025-11-25"),
    },
];


interface Column<T> {
    name: string;
    selector?: (row: T) => string | number;
    sortable?: boolean;
    cell?: (row: T) => JSX.Element;
}


export default function PiecesLivre() {
    const [pieces, setPieces] = useState<PiecesLivre[]>(tableData);
    const [selectedPiece, setSelectedPiece] = useState<PiecesLivre | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const columns: Column<PiecesLivre>[] = [
        {
            name: "Piéce livré client",
            selector: (row) => row.pcs_client,
            sortable: true,
        },
        {
            name: " Piéce livré P1_P2",
            selector: (row) => row.pcs_p1_p2,
            sortable: true,
        },
        {
            name: "Piéce livré P3 ",
            selector: (row) => row.pcs_p3,
            sortable: true,
        },
        {
            name: "Piéce livré Fournisseur ",
            selector: (row) => row.pcs_fournisseur,
            sortable: true,
        },
        {
            name: "Mois",
            selector: (row) => row.pcs_month.toLocaleDateString(),
            sortable: true,
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

    const handleEdit = (row: PiecesLivre) => {
        setSelectedPiece(row);
        setIsModalOpen(true);
    };

    const handleSave = (updatedPiece: PiecesLivre) => {
        setPieces((prev) =>
            prev.map((a) => (a.id === updatedPiece.id ? updatedPiece : a))
        );
    };

    return (
        <>
            <div>
                <PageMeta
                    title="Piéces livrées"
                    description="page de gestion des pièces livrées"
                />
                <PageBreadcrumb pageTitle="Piéce livré " />
                <button
                    onClick={() => navigate("/pieces/ajouter-pieces")}
                    className="px-3 py-3 my-3 text-xs text-white bg-blue-500 rounded hover:bg-blue-700 hover:shadow-xl transition-shadow duration-200"
                >
                    Ajouter une Lot
                </button>
                <div className="grid grid-cols-1 gap-6 ">

                    <DataTableLayout
                        title="Liste des Piéces livrées"
                        columns={columns}
                        data={pieces}
                    />
                    <EditPieceLivreModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        pieceLivre={selectedPiece}
                        onSave={handleSave}
                    />
                </div>
            </div>
        </>
    );
}
