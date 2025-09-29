import { JSX, useState, } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import DataTableLayout from "../../layout/DataTableLayout";
import { useNavigate } from "react-router";
import EditUserModal from "../../components/Utilisateur/EditUserForm";
import EditUserLevelRoleForm from "../../components/Utilisateur/EditUserLevelForm";
import ActionMenu from "../../utils/ActionOption";


interface Utilisateur {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    matricul: string;
    nature: string,
    departement: string,
    role?: string,
    level?: string,
    statut: string,
    image: string,
    zone: string
}

const tableData: Utilisateur[] = [
    {
        id: 1,
        first_name: "chehir",
        last_name: "ben slim",
        email: "benslimchehir@gmail.com",
        matricul: "M123456",
        nature: "Nature A",
        departement: "qualite",
        role: "Admin",
        level: "High",
        statut: "Actif",
        image: "/images/user/owner.jpg",
        zone: "zone A"
    },
    {
        id: 2,
        first_name: "Ahmed",
        last_name: "Ben Ali",
        email: "ahmed.benali@gmail.com",
        matricul: "M654388",
        nature: "Nature B",
        departement: "qualite",
        role: "qualite",
        level: "Medium",
        statut: "Inactif",
        image: "/images/user/user2.jpg",
        zone: "Zone B"
    },
    {
        id: 3,
        first_name: "Mohamed",
        last_name: "Salem",
        email: "mohamed.salem@gmail.com",
        matricul: "M785",
        nature: "Nature A",
        departement: "qualite",
        role: "qualite",
        level: "Medium",
        statut: "Actif",
        image: "/images/user/user3.jpg",
        zone: "Zone A"
    },
    {
        id: 4,
        first_name: "Louay",
        last_name: "MAgouli",
        email: "louay.magouli@gmail.com",
        matricul: "M7899",
        nature: "Nature C",
        departement: "qualite",
        role: "qualite",
        level: "Medium",
        statut: "Actif",
        image: "/images/user/user4.jpg",
        zone: "Zone B"
    },
];

interface Column<T> {
    name: string;
    selector?: (row: T) => string | number;
    sortable?: boolean;
    cell?: (row: T) => JSX.Element;
}


export default function Utlisateurs() {
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>(tableData);
    const [selectedUtilisateur, setSelectedUtilisateur] = useState<Utilisateur | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUserOpen, setIsModalUserOpen] = useState(false);
    const navigate = useNavigate();


    const columns: Column<Utilisateur>[] = [
        {
            name: "Nom & prenom ",
            selector: (row) => row.first_name,
            sortable: true,
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                        <img
                            width={40}
                            height={40}
                            src={row.image}
                            alt={row.image}
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
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: "Matricul",
            selector: (row) => row.matricul,
            sortable: true,
        },
        {
            name: "Nature",
            selector: (row) => row.nature,
            sortable: true,
        },
        {
            name: "Departement",
            selector: (row) => row.departement,
            sortable: true,
        },
        {
            name: "Role",
            selector: (row) => row.role ? row.role : "N/A",
            sortable: true,
        },
        {
            name: "Level",
            selector: (row) => row.level ? row.level : "N/A",
            sortable: true,
        },
        {
            name: "Statut",
            selector: (row) => row.statut,
            sortable: true,
            cell: (row) => (
                <Badge
                    color={
                        row.statut === "Actif"
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
                    {
                        label: "Modifier",
                        onClick: () => handleEdit(row),
                    },
                    {
                        label: "Supprimer",
                        onClick: () => alert(`Supprimer fournisseur ID: ${row.id}`),
                    },
                    {
                        label: "Modifier rôle & level",
                        onClick: () => handleEditUserLevelForm(row),
                    },
                ];

                return <ActionMenu options={options} />;
            },
        }
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
            prev.map((a) => (a.id === updatedUser.id ? updatedUser : a))
        );
    };

    // Fonction pour sauvegarder uniquement le role et le level
    const handleSaveUserLevelRole = (updatedUser: { id: number; role: string; level: string }) => {
        setUtilisateurs((prev) =>
            prev.map((a) =>
                a.id === updatedUser.id
                    ? { ...a, role: updatedUser.role, level: updatedUser.level }
                    : a
            )
        );
    };

    return (
        <>
            <div>
                <PageMeta
                    title="Utilisateurs"
                    description="page de gestion des utilisateurs"
                />
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
                    />
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
                                    id: selectedUtilisateur.id,
                                    role: selectedUtilisateur.role ?? "",
                                    level: selectedUtilisateur.level ?? "",
                                }
                                : null
                        }
                        onSave={handleSaveUserLevelRole}
                    />
                </div>
            </div>
        </>
    );
}
