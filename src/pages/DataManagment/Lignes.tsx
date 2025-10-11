import { JSX, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import DataTableLayout from "../../layout/DataTableLayout";
import { useNavigate } from "react-router";
import EditLigneModal from "../../components/Ligne/EditLigneModel";
import { Update, Trash } from "../../icons";
import { Ligne } from "../../types/Ligne";
import { LigneService } from "../../services/LigneService";
import { UserService } from "../../services/UserService";
import { DepartementService } from "../../services/DepartementService";
import { Departement } from "../../types/Departement";
import { Utilisateur } from "../../types/Utilisateur";

const tableData: Ligne[] = [];

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
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [departements, setDepartements] = useState<Departement[]>([]);
    const [users, setUsers] = useState<Utilisateur[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dataLignes, dataDeps, dataUsers] = await Promise.all([
                    LigneService.getLigne(),
                    DepartementService.getDepartements(),
                    UserService.getUsers(),
                ]);

                if (Array.isArray(dataLignes)) setLignes(dataLignes);
                if (Array.isArray(dataDeps)) setDepartements(dataDeps);
                if (Array.isArray(dataUsers)) setUsers(dataUsers);
            } catch (err) {
                console.error(err);
                setError("Erreur lors du chargement des données.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const departementMap = Object.fromEntries(
        departements.map((d) => [d.id_departement, d.nom_departement])
    );

    const userMap = Object.fromEntries(
        users.map((u) => [u.id_user, `${u.first_name} ${u.last_name}`])
    );

    const handleEdit = (row: Ligne) => {
        setSelectedLigne(row);
        setIsModalOpen(true);
    };

    const handleSave = (updatedLigne: Ligne) => {
        setLignes((prev) =>
            prev.map((a) =>
                a.id_ligne === updatedLigne.id_ligne ? updatedLigne : a
            )
        );
        setIsModalOpen(false);
    };

    const handleDelete = async (id_ligne: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette ligne ?")) return;
        try {
            await LigneService.deleteLigne(id_ligne);
            setLignes((prev) => prev.filter((a) => a.id_ligne !== id_ligne));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };

    const columns: Column<Ligne>[] = [
        {
            name: "Nom de la Ligne",
            selector: (row) => row.nom_ligne,
            sortable: true,
        },
        {
            name: "Référence Ligne",
            selector: (row) => row.ref,
            sortable: true,
        },
        {
            name: "Département",
            selector: (row) => departementMap[row.departement] || "Non défini",
            sortable: true,
        },
        {
            name: "Responsable de la Ligne",
            selector: (row) => userMap[row.responsable] || "Non défini",
            sortable: true,
        },
        {
            name: "Capacité de Production",
            selector: (row) => `${row.cap_production} (Pcs)`,
            sortable: true,
        },
        {
            name: "Dernière Maintenance",
            selector: (row) => row.Date_maintenance,
            sortable: true,
        },
        {
            name: "Prochaine Maintenance",
            selector: (row) => row.proch_entretien,
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
                        onClick={() => handleDelete(row.id_ligne)}
                        className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                    >
                        <Trash className="w-5 h-5 font-bold" />
                    </button>
                </div>
            ),
        },
    ];

    if (loading)
        return <p className="p-4 text-center">⏳ Chargement des Lignes...</p>;
    if (error)
        return <p className="p-4 text-center text-red-600">{error}</p>;

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
                <div className="grid grid-cols-1 gap-6">
                    <DataTableLayout
                        title="Liste des Lignes"
                        columns={columns}
                        data={lignes}
                        loading={loading}
                        error={error}
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
