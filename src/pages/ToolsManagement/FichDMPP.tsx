import { JSX, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTableLayout from "../../layout/DataTableLayout";
import { Modal } from "../../components/ui/modal";
import ActionMenu from "../../utils/ActionOption";
import EditRapportNcModal from "../../components/RapportNC/EditRapportNCForm";
import { useNavigate } from "react-router";
import DynamicFilters from "../../utils/DynamicFilters";
import EditFIchDMPPModal from "../../components/FichDMPP/EditFichDMPPMdoel";
import ModalPreview from "../../utils/ModelPreview";

export default function FichDMPP() {

    interface FichDMPP {
        id: number;
        nom_ligne: string;
        post: string;
        code_artc: string;
        nature: string;
        zone: string;
        date_sou: Date;
        type: string;
        nom_client: string;
        cout_estimative: string;
        etat_actu: string;
        etat_modif: string;
        objectif_modif: string;
    }

    interface Column<T> {
        name: string;
        selector?: (row: T) => string | number;
        sortable?: boolean;
        cell?: (row: T) => JSX.Element;
    }

    const [fichdmpps, setFichdmpps] = useState<FichDMPP[]>([
        {
            id: 1,
            nom_ligne: "Ligne A1",
            post: "Poste 3",
            code_artc: "ART-1234",
            nature: "Défaut d'assemblage",
            zone: "Zone 5",
            date_sou: new Date("2025-09-07"),
            type: "Corrective",
            nom_client: "Client XYZ",
            cout_estimative: "2500",
            etat_actu: "En cours",
            etat_modif: "Planifié",
            objectif_modif: "Réduction des défauts de montage",
        },
        {
            id: 2,
            nom_ligne: "Ligne B1",
            post: "Poste 2",
            code_artc: "ART-1008",
            nature: "Défaut d'assemblage",
            zone: "Zone 1",
            date_sou: new Date("2025-10-07"),
            type: "Corrective",
            nom_client: "Client XYZ",
            cout_estimative: "2500",
            etat_actu: "bloqué",
            etat_modif: "Planifié",
            objectif_modif: "Réduction des défauts de montage Réduction des défauts de montage Réduction des défauts de montage",
        }
    ]);

    const [selectedFichDMPP, SetSelectedFichDMPP] = useState<FichDMPP | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const navigate = useNavigate();


    const openModal = (fichdmpps: FichDMPP) => {
        SetSelectedFichDMPP(fichdmpps);
        setIsModalOpen(true);
    };


    const deleteFichDMPP = (id: number) => {
        setFichdmpps((prev) => prev.filter((r) => r.id !== id));
    };


    const handleEdit = (row: FichDMPP) => {
        SetSelectedFichDMPP(row);
        setIsModalUpdateOpen(true);
    };

    const handleSave = (updatedRapport: FichDMPP) => {
        setFichdmpps((prev) =>
            prev.map((r) => (r.id === updatedRapport.id ? updatedRapport : r))
        );
    };

    const getFichDMPPOptions = (row: FichDMPP) => [
        {
            label: "Modifier",
            onClick: () => handleEdit(row),
        },
        {
            label: "Supprimer",
            onClick: () => deleteFichDMPP(row.id),
        },
    ];

    const [filters, setFilters] = useState<Record<string, string>>({
        nom_ligne: "",
        code_artc: "",
        nature: "",
        zone: "",
        type: "",
        nom_client: "",
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const filterFields = [
        { name: "nom_ligne", placeholder: "Filtrer par nom de ligne" },
        { name: "code_artc", placeholder: "Filtrer par code article" },
        { name: "nature", placeholder: "Filtrer par Nature" },
        { name: "zone", placeholder: "Filtrer par Zone" },
        { name: "type", placeholder: "Filtrer par Type" },
        { name: "nom_client", placeholder: "Filtrer par Nom client" },

    ];
    // Fonction pour filtrer les rapports
    const filteredFichDMPP = fichdmpps.filter((r) => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value) return true; // si pas de filtre → garder
            const fieldValue = String(r[key as keyof FichDMPP] ?? "").toLowerCase();
            return fieldValue.includes(value.toLowerCase());
        });
    });
    /////////

    const columns: Column<FichDMPP>[] = [
        { name: "Ligne", selector: (row) => row.nom_ligne, sortable: true },
        { name: "Poste", selector: (row) => row.post, sortable: true },
        { name: "Réf", selector: (row) => row.code_artc, sortable: true },
        { name: "Nature", selector: (row) => row.nature, sortable: true },
        { name: "Zone", selector: (row) => row.zone, sortable: true },
        {
            name: "Date souhaité",
            selector: (row) => row.date_sou.toLocaleDateString("fr-FR"),
            sortable: true
        },
        { name: "Type (produit/process/Changement de réf) ", selector: (row) => row.type, sortable: true },
        { name: "Description client", selector: (row) => row.nom_client, sortable: true },
        { name: "Coût estimatif ", selector: (row) => row.cout_estimative + " TND", sortable: true },
        {
            name: "Etat actuel",
            cell: (row) => {
                let badgeColor = "bg-gray-300 text-gray-800";

                switch (row.etat_actu.toLowerCase()) {
                    case "en cours":
                        badgeColor = "bg-yellow-100 text-yellow-800";
                        break;
                    case "terminé":
                        badgeColor = "bg-green-100 text-green-800";
                        break;
                    case "planifié":
                        badgeColor = "bg-blue-100 text-blue-800";
                        break;
                    case "bloqué":
                        badgeColor = "bg-red-100 text-red-800";
                        break;
                }

                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
                        {row.etat_actu}
                    </span>
                );
            },
            sortable: true,
        },
        { name: "Etat modifié", selector: (row) => row.etat_modif, sortable: true },
        {
            name: "Objectif",
            cell: (row) => (
                <ModalPreview
                    label={row.objectif_modif}
                    title="Objectif modification"
                    content={row.objectif_modif}
                    maxLength={20}
                />
            ),
        },
        {
            name: "Actions & (AC/AP)",
            cell: (row) => <ActionMenu options={getFichDMPPOptions(row)} />,
        },
    ];

    return (
        <>
            <PageMeta title="Fiche DMPP" description="Gestion des Fiches DMpp" />
            <PageBreadcrumb pageTitle="Fiche DMPP" />
            <button
                onClick={() => navigate("/fich-dmpp/add-fich-dmpp")}
                className="px-3 py-3 my-3 text-xs text-white bg-blue-500 rounded hover:bg-blue-700 hover:shadow-xl transition-shadow duration-200"
            >
                Ajouter une Fich DMPP
            </button>
            <div className="grid grid-cols-1 gap-6 ">
                <DynamicFilters filters={filters} onFilterChange={handleFilterChange} fields={filterFields} />
                <DataTableLayout
                    title="Liste des FicheS DMPP"
                    columns={columns}
                    data={filteredFichDMPP}
                />
            </div>
            <EditFIchDMPPModal
                isOpen={isModalUpdateOpen}
                onClose={() => setIsModalUpdateOpen(false)}
                fichdmpps={selectedFichDMPP}
                onSave={handleSave}
            />
        </>
    );
}
