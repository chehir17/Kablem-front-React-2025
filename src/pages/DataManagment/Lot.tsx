import { JSX, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTableLayout from "../../layout/DataTableLayout";
import { Trash, Update } from "../../icons";
import { Lot } from "../../types/Lot";
import { LotService } from "../../services/LotService";
import AddLotForm from "../../components/Lot/AddLotForm";
import EditLotModal from "../../components/Lot/EditLotForm";

const tableData: Lot[] = [];

interface Column<T> {
    name: string;
    selector?: (row: T) => string | number;
    sortable?: boolean;
    cell?: (row: T) => JSX.Element;
}

export default function LotPage() {

    const [lots, setLots] = useState<Lot[]>(tableData);
    const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await LotService.getLot();
                if (Array.isArray(data)) {
                    setLots(data);
                } else {
                    console.error("⚠️ La réponse n'est pas un tableau :", data);
                    setLots([]);
                }
            } catch (err) {
                setError("Impossible de charger les lots.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const handleEdit = (row: Lot) => {
        setSelectedLot(row);
        setIsModalOpen(true);
    };

    const handleSave = (updatedLot: Lot) => {
        setLots((prev) =>
            prev.map((a) =>
                a.id_lot === updatedLot.id_lot ? updatedLot : a
            )
        );
        setIsModalOpen(false);
    };

    const handleDelete = async (id_lot: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet Lot ?")) return;
        try {
            await LotService.deleteLot(id_lot);
            setLots((prev) => prev.filter((a) => a.id_lot !== a.id_lot));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };

    const columns: Column<Lot>[] = [
        {
            name: "Num de lot",
            selector: (row) => row.num_lot,
            sortable: true,
        },
        {
            name: "Date de production",
            selector: (row) => row.date_prod ? new Date(row.date_prod).toLocaleDateString() : "—",
            sortable: true,
        },
        {
            name: "Quantité produite",
            selector: (row) => row.qnt_produit,
            sortable: true,
        },
        {
            name: "Article",
            selector: (row) => row.nom_artc,
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
                        <Update className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id_lot)}
                        className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                    >
                        <Trash className="w-5 h-5" />
                    </button>
                </div>
            ),
        },
    ];

    if (loading) return <p className="p-4 text-center dark:text-white/70">⏳ Chargement des Lots...</p>;
    if (error) return <p className="p-4 text-center text-red-600">{error}</p>;

    return (
        <div>
            <PageMeta title="Lots" description="Page de gestion des Lot" />
            <PageBreadcrumb pageTitle="Lot" />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                    <DataTableLayout
                        title="Liste des lots"
                        columns={columns}
                        data={lots}
                        loading={loading}
                        error={error}
                    />
                    {selectedLot && (
                        <EditLotModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            lot={selectedLot}
                            onSave={handleSave}
                        />
                    )}
                </div>

                <div className="space-y-6 xl:col-span-1">
                    <AddLotForm />
                </div>
            </div>
        </div>
    );
}
