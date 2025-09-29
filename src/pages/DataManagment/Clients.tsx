import { JSX, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import DataTableLayout from "../../layout/DataTableLayout";
import AddClientForm from "../../components/Client/AddClientForm";
import EditClientModal from "../../components/Client/EditClientModel";
import { Trash } from "../../icons";
import { Update } from "../../icons";

interface Client {
    id: number;
    nom_client: string;
    reference_client: string;
    societe: string;
    email: string,
    status: string,
}

const tableData: Client[] = [
    {
        id: 1,
        nom_client: "Client A",
        reference_client: "REF123",
        societe: "Societe A",
        email: "clienta@example.com",
        status: "Actif",
    },
    {
        id: 2,
        nom_client: "Client B",
        reference_client: "REF456",
        societe: "Societe B",
        email: "clientb@example.com",
        status: "Inactif",
    },
];

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

    const columns: Column<Client>[] = [
        {
            name: "Nom du Client",
            selector: (row) => row.nom_client,
            sortable: true,
        },
        {
            name: "Référence Client",
            selector: (row) => row.reference_client,
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
                        onClick={() => alert(`Supprimer client ID: ${row.id}`)}
                        className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                    >
                        <Trash className="w-5 h-5 font-bold" />
                    </button>
                </div>
            ),
        },
    ];

    const handleEdit = (row: Client) => {
        setSelectedClient(row);
        setIsModalOpen(true);
    };

    const handleSave = (updatedClient: Client) => {
        setClients((prev) =>
            prev.map((a) => (a.id === updatedClient.id ? updatedClient : a))
        );
    };

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
                        />
                        <EditClientModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            client={selectedClient}
                            onSave={handleSave}
                        />
                    </div>

                    <div className="space-y-6 xl:col-span-1">
                        <AddClientForm />
                    </div>
                </div>
            </div>
        </>
    );
}
