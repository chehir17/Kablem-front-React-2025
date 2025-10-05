import { JSX, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import DataTableLayout from "../../layout/DataTableLayout";
import { useNavigate } from "react-router";
import EditUserModal from "../../components/Utilisateur/EditUserForm";
import EditUserLevelRoleForm from "../../components/Utilisateur/EditUserLevelForm";
import ActionMenu from "../../utils/ActionOption";
import { Utilisateur } from "../../types/Utilisateur";
import { UserService } from "../../services/UserService";
import { DepartementService } from "../../services/DepartementService";
import { Departement } from "../../types/Departement";

const tableData: Utilisateur[] = [];

interface Column<T> {
    name: string;
    selector?: (row: T) => string | number;
    sortable?: boolean;
    cell?: (row: T) => JSX.Element;
}

export default function Utlisateurs() {
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>(tableData);
    const [departements, setDepartements] = useState<Departement[]>([]);
    const [selectedUtilisateur, setSelectedUtilisateur] = useState<Utilisateur | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUserOpen, setIsModalUserOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await UserService.getUsers();
                const depsResponse = await DepartementService.getDepartements(); // ✅ récupère tous les départements
                setUtilisateurs(users);
                setDepartements(depsResponse);
            } catch (err) {
                setError("Impossible de charger les utilisateurs ou les départements.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Fonction utilitaire pour trouver le nom du département
    const getDepartementName = (id: string | number) => {
        const dep = departements.find((d) => d.id_departement === Number(id));
        return dep ? dep.nom_departement : "N/A";
    };

    const columns: Column<Utilisateur>[] = [
        {
            name: "Nom & prénom",
            selector: (row) => row.first_name,
            sortable: true,
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img
                            width={40}
                            height={40}
                            src={`http://localhost/platforme_KablemSPA_backEnd/public/files/${row.photo}`}
                            alt={row.photo}
                        />
                    </div>
                    <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-gray-400">
                            {row.first_name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {row.last_name}
                        </span>
                    </div>
                </div>
            ),
        },
        { name: "Email", selector: (row) => row.email, sortable: true },
        { name: "Matricul", selector: (row) => row.matricul, sortable: true },
        { name: "Nature", selector: (row) => row.nature, sortable: true },
        {
            name: "Département",
            selector: (row) => getDepartementName(row.id_departement),
            sortable: true,
        },
        {
            name: "Role",
            selector: (row) => row.role ?? "N/A",
            sortable: true,
        },
        {
            name: "Level",
            selector: (row) => row.level ?? "N/A",
            sortable: true,
        },
        {
            name: "Statut",
            selector: (row) => row.statut,
            sortable: true,
            cell: (row) => (
                <Badge
                    color={
                        row.statut === "actif"
                            ? "success"
                            : row.statut === "Inactif"
                                ? "warning"
                                : "error"
                    }
                    variant="light"
                >
                    {row.statut}
                </Badge>
            ),
        },
        {
            name: "Actions",
            cell: (row) => {
                const options = [
                    { label: "Modifier", onClick: () => handleEdit(row) },
                    { label: "Supprimer", onClick: () => alert(`Supprimer ID: ${row.id_user}`) },
                    { label: "Modifier rôle & level", onClick: () => handleEditUserLevelForm(row) },
                ];

                return <ActionMenu options={options} />;
            },
        },
    ];

    const handleEdit = (row: Utilisateur) => {
        setSelectedUtilisateur(row);
        setIsModalOpen(true);
    };

    const handleEditUserLevelForm = (row: Utilisateur) => {
        setSelectedUtilisateur(row);
        setIsModalUserOpen(true);
    };

    const handleSave = (updatedUser: Utilisateur) => {
        setUtilisateurs((prev) =>
            prev.map((a) => (a.id_user === updatedUser.id_user ? updatedUser : a))
        );
    };

    const handleSaveUserLevelRole = (updatedUser: {
        id_user: number;
        role: string;
        level: string;
    }) => {
        setUtilisateurs((prev) =>
            prev.map((a) =>
                a.id_user === updatedUser.id_user
                    ? { ...a, role: updatedUser.role, level: updatedUser.level }
                    : a
            )
        );
    };

    return (
        <>
            <PageMeta title="Utilisateurs" description="page de gestion des utilisateurs" />
            <PageBreadcrumb pageTitle="Utilisateurs" />

            <button
                onClick={() => navigate("/utilisateurs/ajouter-utilisateur")}
                className="px-3 py-3 my-3 text-xs text-white bg-blue-500 rounded hover:bg-blue-700 hover:shadow-xl transition-shadow duration-200"
            >
                Ajouter un Utilisateur
            </button>

            <div className="grid grid-cols-1 gap-6">
                <DataTableLayout
                    title="Liste des Utilisateurs"
                    columns={columns}
                    data={utilisateurs}
                    loading={loading}
                    error={error}
                />

                {/* Modals */}
                <EditUserModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    user={selectedUtilisateur}
                    onSave={handleSave}
                />
                <EditUserLevelRoleForm
                    isOpen={isModalUserOpen}
                    onClose={() => setIsModalUserOpen(false)}
                    user={
                        selectedUtilisateur
                            ? {
                                id_user: selectedUtilisateur.id_user,
                                role: selectedUtilisateur.role ?? "",
                                level: selectedUtilisateur.level ?? "",
                            }
                            : null
                    }
                    onSave={handleSaveUserLevelRole}
                />
            </div>
        </>
    );
}
