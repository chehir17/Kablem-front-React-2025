import { JSX, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTableLayout from "../../layout/DataTableLayout";
import ActionMenu from "../../utils/ActionOption";
import { useNavigate } from "react-router";
import DynamicFilters from "../../utils/DynamicFilters";
import EditRapportNcModal from "../../components/RapportNC/EditRapportNCForm";
import EditRegisterSCRAPModel from "../../components/RegisterSCARP/EditRegisterSCRAPModel";
import ModalPreview from "../../utils/ModelPreview";

export default function RegistreSCRAP() {

    interface RegistreSCRAP {
        id: number;
        created_at: string;
        compilateur: string
        zone_affe_prob: string;
        annulation: string;
        desc_prob: string;
        code_artc: string;
        date_prod: Date;
        first_name: string;
        cout_unit: string;
        machine: string;
        mini: string;
        nom_ligne: string;
        table_elec: string;
        qnt_produit: string;
        qnt_scrap: string;
        cause_prob: string;
        classification_cause: string;
        ac_immed_prend: string;
        rebut_remplacer: string;
        odl_rep: string;
        new_odl: string;
        Desc_acmo: string;
        N_pecRec: string;
        qnt_rebF: string;
        h_interne: string;
        h_externe: string;
        cout_final: string;
        res_pos: string;
        ac_corr_suppl: string;
        N_ac_corr_ex: string;
        note: string;
        poids_rebut: string;
        valeur_scrap: string;
        level: string
    }

    interface Column<T> {
        name: string;
        selector?: (row: T) => string | number;
        sortable?: boolean;
        cell?: (row: T) => JSX.Element;
    }

    const [registrScrap, setRegistrScrap] = useState<RegistreSCRAP[]>([
        {
            id: 1,
            created_at: "2025-01-26T10:35:00Z",
            compilateur: "Ali Ben Salem",
            zone_affe_prob: "Zone d’assemblage",
            annulation: "Non",
            desc_prob: "Pièces fissurées après soudage",
            code_artc: "ART-4521",
            date_prod: new Date("2025-01-25"),
            first_name: "Ahmed",
            cout_unit: "15.50",
            machine: "Soudure-SM23",
            mini: "N/A",
            nom_ligne: "Ligne 3 - Assemblage",
            table_elec: "TE-45",
            qnt_produit: "500",
            qnt_scrap: "25",
            cause_prob: "Mauvais réglage de la température de soudage",
            classification_cause: "Erreur humaine / Réglage machine",
            ac_immed_prend: "Arrêt de la machine, réglage corrigé, pièces isolées.",
            rebut_remplacer: "Oui",
            odl_rep: "ODL-9845",
            new_odl: "ODL-9846",
            Desc_acmo: "Maintenance corrective effectuée sur le système de contrôle.",
            N_pecRec: "PEC-302",
            qnt_rebF: "25",
            h_interne: "3.5",
            h_externe: "0",
            cout_final: "387.50",
            res_pos: "Production redémarrée avec paramètres corrigés.",
            ac_corr_suppl: "Formation opérateur sur réglages machine.",
            N_ac_corr_ex: "AC-215",
            note: "Incident similaire observé le mois dernier.",
            poids_rebut: "12.5",
            valeur_scrap: "312.50",
            level: 'medium_level'
        }

    ]);

    const [selectedRegistreScrap, SetSelectedRegistreScrap] = useState<RegistreSCRAP | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const navigate = useNavigate();


    // const openModal = (registerscraps: RegistreSCRAP) => {
    //     setRegistrScrap(registerscraps);
    //     setIsModalOpen(true);
    // };


    const deleteRegisterScrap = (id: number) => {
        setRegistrScrap((prev) => prev.filter((r) => r.id !== id));
    };


    const handleEdit = (row: RegistreSCRAP) => {
        SetSelectedRegistreScrap(row);
        setIsModalUpdateOpen(true);
    };

    const handleSave = (updatedRegisterScrap: RegistreSCRAP) => {
        setRegistrScrap((prev) =>
            prev.map((r) => (r.id === updatedRegisterScrap.id ? updatedRegisterScrap : r))
        );
    };

    // --- Menu dynamique
    const getFichDMPPOptions = (row: RegistreSCRAP) => [
        {
            label: "Modifier",
            onClick: () => handleEdit(row),
        },
        {
            label: "Supprimer",
            onClick: () => deleteRegisterScrap(row.id),
        },
    ];

    const [filters, setFilters] = useState<Record<string, string>>({
        compilateur: "",
        zone_affe_prob: "",
        code_artc: "",
        first_name: "",
        machine: "",
        nom_ligne: "",
        table_elec: "",
        N_pecRec: "",
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const filterFields = [
        { name: "compilateur", placeholder: "Compilateur" },
        { name: "zone_affe_prob", placeholder: "Zone affectation de probleme" },
        { name: "code_artc", placeholder: "Code Article" },
        { name: "first_name", placeholder: "Client" },
        { name: "machine", placeholder: "Machine" },
        { name: "table_elec", placeholder: "table electrique" },
        { name: "nom_ligne", placeholder: "Non de ligne" },
        { name: "N_ac_corr_ex", placeholder: "N° actions correctives externes" },

    ];
    // Fonction pour filtrer les rapports
    const filteredRegsitrScrap = registrScrap.filter((r) => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value) return true; // si pas de filtre → garder
            const fieldValue = String(r[key as keyof RegistreSCRAP] ?? "").toLowerCase();
            return fieldValue.includes(value.toLowerCase());
        });
    });
    /////////

    const columns: Column<RegistreSCRAP>[] = [
        { name: "Created At", selector: (row) => row.created_at, sortable: true },
        { name: "Compilateur", selector: (row) => row.compilateur, sortable: true },
        { name: "Zone", selector: (row) => row.zone_affe_prob, sortable: true },
        { name: "Annulation", selector: (row) => row.annulation, sortable: true },
        { name: "Description de probleme", selector: (row) => row.desc_prob, sortable: true },
        { name: "Code article", selector: (row) => row.code_artc, sortable: true },
        {
            name: "Date Production",
            selector: (row) => row.date_prod.toLocaleDateString("fr-FR"),
            sortable: true
        },
        { name: "Opérateur 1", selector: (row) => row.first_name, sortable: true },
        { name: "Costo_U", selector: (row) => row.cout_unit, sortable: true },
        { name: "Machine", selector: (row) => row.machine, sortable: true },
        { name: "Mini", selector: (row) => row.mini, sortable: true },
        { name: "Ligne Assemblage", selector: (row) => row.nom_ligne, sortable: true },
        { name: "Table électrique", selector: (row) => row.table_elec, sortable: true },
        { name: "Qté du Lot", selector: (row) => row.qnt_produit, sortable: true },
        { name: "Qté de scrap", selector: (row) => row.qnt_scrap, sortable: true },
        { name: "Cause Probéme", selector: (row) => row.cause_prob, sortable: true },
        { name: "Classification de la cause", selector: (row) => row.classification_cause, sortable: true },
        {
            name: "Actions a prendre",
            cell: (row) => (
                <ModalPreview
                    label={row.ac_immed_prend}
                    title="Actions a prendre"
                    content={row.ac_immed_prend}
                    maxLength={20}
                />
            ),
            sortable: true
        },
        { name: "Rebut remplacé", selector: (row) => row.rebut_remplacer, sortable: true },
        { name: "ODL a relancer par la logistique ", selector: (row) => row.odl_rep, sortable: true },
        { name: "Nouvelle ODL", selector: (row) => row.new_odl, sortable: true },
        { name: "Description de  Action mise en oeuvre", selector: (row) => row.Desc_acmo, sortable: true },
        { name: "Qté Rebutée finale", selector: (row) => row.qnt_rebF, sortable: true },
        { name: "Heures internes dépensés pour rework", selector: (row) => row.h_interne, sortable: true },
        { name: "Heures externes dépensés", selector: (row) => row.h_externe, sortable: true },
        { name: "Cout finale", selector: (row) => row.cout_final, sortable: true },
        { name: "Résultat positif de tri", selector: (row) => row.res_pos, sortable: true },
        {
            name: "Actions correctives supplémentaires",
            cell: (row) => (
                <ModalPreview
                    label={row.ac_corr_suppl}
                    title="Actions correctives supplémentaires"
                    content={row.ac_corr_suppl}
                    maxLength={20}
                />
            ),
            sortable: true
        },
        { name: "N° actions correctives externes", selector: (row) => row.N_ac_corr_ex, sortable: true },
        { name: "Notes", selector: (row) => row.note, sortable: true },
        { name: "Poids rebuts", selector: (row) => row.poids_rebut, sortable: true },
        { name: "Valeur SCRAP", selector: (row) => row.valeur_scrap, sortable: true },
        {
            name: "ajout plan action ",
            cell: (row) => {
                return <button
                    onClick={() => navigate("/fich-dmpp/add-fich-dmpp/" + row.id)}
                    className="px-1 py-1 my-1 text-xs text-white bg-orange-500 rounded hover:bg-orange-700 hover:shadow-xl transition-shadow duration-200"
                >
                 plan d'action
                </button>;
            }
        },
        {
            name: "Actions",
            cell: (row) => <ActionMenu options={getFichDMPPOptions(row)} />,
        },
    ];

    return (
        <>
            <PageMeta title="Registre SCRAP" description="Gestion des rapports NC" />
            <PageBreadcrumb pageTitle="Registre SCRAP" />
            <button
                onClick={() => navigate("/scrap/add-reg-scrap")}
                className="px-3 py-3 my-3 text-xs text-white bg-blue-500 rounded hover:bg-blue-700 hover:shadow-xl transition-shadow duration-200"
            >
                Ajouter un Registre scrap
            </button>
            <div className="grid grid-cols-1 gap-6 ">
                <DynamicFilters filters={filters} onFilterChange={handleFilterChange} fields={filterFields} />
                <DataTableLayout
                    title="Liste des RegistreS SCRAP"
                    columns={columns}
                    data={filteredRegsitrScrap}
                />
            </div>
            <EditRegisterSCRAPModel
                isOpen={isModalUpdateOpen}
                onClose={() => setIsModalUpdateOpen(false)}
                registerscraps={selectedRegistreScrap}
                onSave={handleSave}
            />
        </>
    );
}
