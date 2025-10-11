import { JSX, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import DataTableLayout from "../../layout/DataTableLayout";
import AddFournisseurForm from "../../components/Fournisseur/AddFournisseurForm";
import EditFournisseurModal from "../../components/Fournisseur/EditFournisseurModel";
import { Trash } from "../../icons";
import { Update } from "../../icons";
import { Fournisseur } from "../../types/Fournisseur";
import { FournisseurService } from "../../services/FournisseurService";

const tableData: Fournisseur[] = [];

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
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await FournisseurService.getFournisseur();
                if (Array.isArray(data)) {
                    setFournisseurs(data);
                } else {
                    console.error("La réponse n'est pas un tableau :", data);
                    setFournisseurs([]);
                }
            } catch (err) {
                setError("Impossible de charger les Fournisseur.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEdit = (row: Fournisseur) => {
        setSelectedFournisseur(row);
        setIsModalOpen(true);
    };


    const handleSave = (updatedArticle: Fournisseur) => {
        setFournisseurs((prev) =>
            prev.map((a) =>
                a.id_fournisseur === updatedArticle.id_fournisseur ? updatedArticle : a
            )
        );
        setIsModalOpen(false);
    };

    const handleDelete = async (id_fournisseur: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet client ?")) return;
        try {
            await FournisseurService.deleteFournisseur(id_fournisseur);
            setFournisseurs((prev) => prev.filter((a) => a.id_fournisseur !== id_fournisseur));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };

    const columns: Column<Fournisseur>[] = [
        {
            name: "Nom du Fournisseur",
            selector: (row) => row.nom_fournisseur,
            sortable: true,
        },
        {
            name: "Référence Fournisseur",
            selector: (row) => row.ref_fournisseur,
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
                        row.status === "actif"
                            ? "success"
                            : row.status === "inactif"
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
                        onClick={() => handleDelete(row.id_fournisseur)}
                        className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                    >
                        <Trash className="w-5 h-5 font-bold" />
                    </button>
                </div>
            ),
        },
    ];



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
                            loading={loading}
                            error={error}
                        />
                        {selectedFournisseur && (
                            <EditFournisseurModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                fournisseur={selectedFournisseur}
                                onSave={handleSave}
                            />
                        )}
                    </div>

                    <div className="space-y-6 xl:col-span-1">
                        <AddFournisseurForm />
                    </div>
                </div>
            </div>
        </>
    );
}
