import { JSX, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import DataTableLayout from "../../layout/DataTableLayout";
import AddClientForm from "../../components/Client/AddClientForm";
import EditClientModal from "../../components/Client/EditClientModel";
import { Trash } from "../../icons";
import { Update } from "../../icons";
import { Client } from "../../types/Client";
import { ClientService } from "../../services/ClientService";

const tableData: Client[] = [];


interface Column<T> {
    name: string;
    selector?: (row: T) => string | number;
    sortable?: boolean;
    cell?: (row: T) => JSX.Element;
}


export default function Clients() {
    const [clients, setClients] = useState<Client[]>(tableData);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await ClientService.getClient();
                if (Array.isArray(data)) {
                    setClients(data);
                } else {
                    console.error("La réponse n'est pas un tableau :", data);
                    setClients([]);
                }
            } catch (err) {
                setError("Impossible de charger les articles.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEdit = (row: Client) => {
        setSelectedClient(row);
        setIsModalOpen(true);
    };

    const handleSave = (updatedArticle: Client) => {
        setClients((prev) =>
            prev.map((a) =>
                a.id_client === updatedArticle.id_client ? updatedArticle : a
            )
        );
        setIsModalOpen(false);
    };

    const handleDelete = async (id_client: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet client ?")) return;
        try {
            await ClientService.deleteClient(id_client);
            setClients((prev) => prev.filter((a) => a.id_client !== id_client));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };

    const columns: Column<Client>[] = [
        {
            name: "Nom du Client",
            selector: (row) => row.nom_client,
            sortable: true,
        },
        {
            name: "Référence Client",
            selector: (row) => row.ref,
            sortable: true,
        },
        {
            name: "Société",
            selector: (row) => row.societe,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: "Status",
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
                        onClick={() => alert(`Supprimer client ID: ${row.id_client}`)}
                        className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                    >
                        <Trash className="w-5 h-5 font-bold" />
                    </button>
                </div>
            ),
        },
    ];

    if (loading) return <p className="p-4 text-center">⏳ Chargement des Clients...</p>;
    if (error) return <p className="p-4 text-center text-red-600">{error}</p>;

    return (
        <>
            <div>
                <PageMeta
                    title="Clients"
                    description="page de gestion des clients"
                />
                <PageBreadcrumb pageTitle="Clients" />
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="space-y-6 xl:col-span-2">
                        <DataTableLayout
                            title="Liste des Clients"
                            columns={columns}
                            data={clients}
                            loading={loading}
                            error={error}
                        />
                        {selectedClient && (
                            <EditClientModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                client={selectedClient}
                                onSave={handleSave}
                            />
                        )}
                    </div>

                    <div className="space-y-6 xl:col-span-1">
                        <AddClientForm />
                    </div>
                </div>
            </div>
        </>
    );
}
