import { JSX, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTableLayout from "../../layout/DataTableLayout";
import { useNavigate } from "react-router";
import EditPieceLivreModal from "../../components/PieceLivre/EditPieceLivreForm";
import { Update } from "../../icons";
import { Trash } from "../../icons";
import { Piece } from "../../types/Piece";
import { Client } from "../../types/Client";
import { Fournisseur } from "../../types/Fournisseur";
import { PieceLivreService } from "../../services/PieceLivreService";
import { ClientService } from "../../services/ClientService";
import { FournisseurService } from "../../services/FournisseurService";



const tableData: Piece[] = [];


interface Column<T> {
    name: string;
    selector?: (row: T) => string | number;
    sortable?: boolean;
    cell?: (row: T) => JSX.Element;
}


export default function PiecesLivre() {
    const [pieces, setPieces] = useState<Piece[]>(tableData);
    const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [clients, setClients] = useState<Client[]>([]);
    const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dataPiece, dataClients, dataFournisseur] = await Promise.all([
                    PieceLivreService.getPieceLivre(),
                    ClientService.getClient(),
                    FournisseurService.getFournisseur(),
                ]);

                if (Array.isArray(dataPiece)) setPieces(dataPiece);
                if (Array.isArray(dataClients)) setClients(dataClients);
                if (Array.isArray(dataFournisseur)) setFournisseurs(dataFournisseur);
            } catch (err) {
                console.error(err);
                setError("Erreur lors du chargement des données.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const clientMap = Object.fromEntries(
        clients.map((d) => [d.id_client, d.nom_client])
    );

    const FournisseurMap = Object.fromEntries(
        fournisseurs.map((u) => [u.id_fournisseur, `${u.nom_fournisseur}`])
    );

    const handleEdit = (row: Piece) => {
        setSelectedPiece(row);
        setIsModalOpen(true);
    };

    const handleSave = (updatedPiece: Piece) => {
        setPieces((prev) =>
            prev.map((a) => (a.id_piece === updatedPiece.id_piece ? updatedPiece : a))
        );
    };

    const handleDelete = async (id_piece: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette Piece ?")) return;
        try {
            await PieceLivreService.deletePiece(id_piece);
            setPieces((prev) => prev.filter((a) => a.id_piece !== id_piece));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };

    const columns: Column<Piece>[] = [
        {
            name: "Piéce livré client",
            selector: (row) => clientMap[row.id_client] || "Non défini",
            sortable: true,
        },
        {
            name: " Piéce livré P1_P2",
            selector: (row) => row.p1_p2,
            sortable: true,
        },
        {
            name: "Piéce livré P3 ",
            selector: (row) => row.p3,
            sortable: true,
        },
        {
            name: "Piéce livré Fournisseur ",
            selector: (row) => FournisseurMap[row.id_fournisseur] || "Non défini",
            sortable: true,
        },
        {
            name: "Mois",
            selector: (row) => row.month,
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
                        onClick={() => handleDelete(row.id_piece)}
                        className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                    >
                        <Trash className="w-5 h-5 font-bold" />
                    </button>
                </div>
            ),
        },
    ];


    if (loading)
        return <p className="p-4 text-center dark:text-white/70">⏳ Chargement des Pieces...</p>;
    if (error)
        return <p className="p-4 text-center text-red-600">{error}</p>;
    
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
                        loading={loading}
                        error={error}
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
