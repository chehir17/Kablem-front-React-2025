import { JSX, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DataTableLayout from "../../layout/DataTableLayout";
import { Modal } from "../../components/ui/modal";
import ActionMenu from "../../utils/ActionOption";
import EditRapportNcModal from "../../components/RapportNC/EditRapportNCForm";
import { useNavigate } from "react-router";
import DynamicFilters from "../../utils/DynamicFilters";
import ModalPreview from "../../utils/ModelPreview";
import ImageCarousel from "../../utils/ImageCarousel";

export default function RapportNonConformite() {
    interface RAPAction {
        id: number;
        type: "ac" | "ap";
        description: string;
    }

    interface RapportNC {
        id: number;
        date: string;
        code_article: string;
        lot: string;
        sujet: string;
        photo_ok?: string;
        photo_nok?: string;
        photo_idant?: string;
        quantite_nc: number;
        process: string;
        client: string;
        occurance_defaut: string;
        ac_immed: string;
        date_ac_immed: string;
        date_verif_ac_immed: string;
        ac_ap: RAPAction[];
    }

    interface Column<T> {
        name: string;
        selector?: (row: T) => string | number;
        sortable?: boolean;
        cell?: (row: T) => JSX.Element;
    }


    const [rapports, setRapports] = useState<RapportNC[]>([
        {
            id: 1,
            date: "2025-09-01",
            code_article: "ART-001",
            lot: "LOT-22",
            sujet: "Non conformité emballage",
            photo_ok: "/images/photo/photok.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            photo_idant: "/images/photo/photoidant.jpg",
            quantite_nc: 12,
            process: "Production",
            client: "Client A",
            occurance_defaut: "Fréquent",
            ac_immed: "Isolement du lot",
            date_ac_immed: "2025-09-02",
            date_verif_ac_immed: "2025-09-02",
            ac_ap: [
                { id: 1, type: "ac", description: "Revoir le packaging" },
                { id: 2, type: "ap", description: "Former l’opérateur" },
            ],
        },
        {
            id: 2,
            date: "2024-11-01",
            code_article: "ART-002",
            lot: "LOT-23",
            sujet: "Non conformité emballage",
            photo_ok: "/images/photo/cable.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            photo_idant: "/images/photo/photoidant.jpg",
            quantite_nc: 200,
            process: "Production",
            client: "Client B",
            occurance_defaut: "Fréquent",
            ac_immed: "Isolement du lot",
            date_ac_immed: "2025-11-02",
            date_verif_ac_immed: "2025-12-25",
            ac_ap: [
                { id: 1, type: "ac", description: "Revoir le packaging" },
                { id: 2, type: "ap", description: "Former l’opérateur" },
            ],
        },
        {
            id: 3,
            date: "2025-09-05",
            code_article: "ART-003",
            lot: "LOT-30",
            sujet: "Pièce manquante dans le kit",
            photo_ok: "/images/photo/photok.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            photo_idant: "/images/photo/photoidant.jpg",
            quantite_nc: 8,
            process: "Assemblage",
            client: "Client C",
            occurance_defaut: "Rare",
            ac_immed: "Compléter les kits avant expédition",
            date_ac_immed: "2025-09-06",
            date_verif_ac_immed: "2025-09-07",
            ac_ap: [
                { id: 1, type: "ac", description: "Contrôle visuel en fin de ligne" },
                { id: 2, type: "ap", description: "Mettre checklist opérateur" },
            ],
        },
        {
            id: 4,
            date: "2025-08-15",
            code_article: "ART-004",
            lot: "LOT-45",
            sujet: "Rayures sur surface produit",
            photo_ok: "/images/photo/photok.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            photo_idant: "/images/photo/photoidant.jpg",
            quantite_nc: 30,
            process: "Finition",
            client: "Client D",
            occurance_defaut: "Occasionnel",
            ac_immed: "Retoucher les pièces rayées",
            date_ac_immed: "2025-08-16",
            date_verif_ac_immed: "2025-08-18",
            ac_ap: [
                { id: 1, type: "ac", description: "Installer protection sur convoyeur" },
                { id: 2, type: "ap", description: "Former sur manipulation correcte" },
            ],
        },
        {
            id: 5,
            date: "2025-07-20",
            code_article: "ART-005",
            lot: "LOT-50",
            sujet: "Couleur non conforme",
            photo_ok: "/images/photo/photok.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            photo_idant: "/images/photo/photoidant.jpg",
            quantite_nc: 100,
            process: "Peinture",
            client: "Client E",
            occurance_defaut: "Fréquent",
            ac_immed: "Stopper la ligne et isoler le lot",
            date_ac_immed: "2025-07-21",
            date_verif_ac_immed: "2025-07-23",
            ac_ap: [
                { id: 1, type: "ac", description: "Réglage machine peinture" },
                { id: 2, type: "ap", description: "Suivi hebdo des paramètres" },
            ],
        },
        {
            id: 6,
            date: "2025-06-10",
            code_article: "ART-006",
            lot: "LOT-55",
            sujet: "Dimensions hors tolérances",
            photo_ok: "/images/photo/photok.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            photo_idant: "/images/photo/photoidant.jpg",
            quantite_nc: 50,
            process: "Usinage",
            client: "Client F",
            occurance_defaut: "Fréquent",
            ac_immed: "Arrêter la machine et isoler les pièces",
            date_ac_immed: "2025-06-11",
            date_verif_ac_immed: "2025-06-13",
            ac_ap: [
                { id: 1, type: "ac", description: "Recalibrer machine" },
                { id: 2, type: "ap", description: "Contrôle dimensionnel renforcé" },
            ],
        },
        {
            id: 7,
            date: "2025-05-15",
            code_article: "ART-007",
            lot: "LOT-60",
            sujet: "Produit cassé au transport",
            photo_ok: "/images/photo/photok.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            photo_idant: "/images/photo/photoidant.jpg",
            quantite_nc: 25,
            process: "Logistique",
            client: "Client G",
            occurance_defaut: "Occasionnel",
            ac_immed: "Renforcer emballage",
            date_ac_immed: "2025-05-16",
            date_verif_ac_immed: "2025-05-20",
            ac_ap: [
                { id: 1, type: "ac", description: "Charger test de résistance carton" },
                { id: 2, type: "ap", description: "Négocier transport avec fournisseur" },
            ],
        },
        {
            id: 8,
            date: "2025-04-10",
            code_article: "ART-008",
            lot: "LOT-65",
            sujet: "Déformation plastique",
            photo_ok: "/images/photo/photok.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            photo_idant: "/images/photo/photoidant.jpg",
            quantite_nc: 40,
            process: "Injection",
            client: "Client H",
            occurance_defaut: "Fréquent",
            ac_immed: "Arrêter presse injection",
            date_ac_immed: "2025-04-11",
            date_verif_ac_immed: "2025-04-12",
            ac_ap: [
                { id: 1, type: "ac", description: "Réglage température moule" },
                { id: 2, type: "ap", description: "Maintenance préventive machine" },
            ],
        },
        {
            id: 9,
            date: "2025-03-22",
            code_article: "ART-009",
            lot: "LOT-70",
            sujet: "Mauvais perçage",
            photo_ok: "/images/photo/photok.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            photo_idant: "/images/photo/photoidant.jpg",
            quantite_nc: 15,
            process: "Perçage",
            client: "Client I",
            occurance_defaut: "Rare",
            ac_immed: "Arrêter série",
            date_ac_immed: "2025-03-23",
            date_verif_ac_immed: "2025-03-24",
            ac_ap: [
                { id: 1, type: "ac", description: "Vérifier gabarits" },
                { id: 2, type: "ap", description: "Ajouter contrôle intermédiaire" },
            ],
        },
        {
            id: 10,
            date: "2025-02-12",
            code_article: "ART-010",
            lot: "LOT-75",
            sujet: "Mauvais collage étiquette",
            photo_ok: "/images/photo/photok.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            photo_idant: "/images/photo/photoidant.jpg",
            quantite_nc: 60,
            process: "Conditionnement",
            client: "Client J",
            occurance_defaut: "Occasionnel",
            ac_immed: "Réajuster colle",
            date_ac_immed: "2025-02-13",
            date_verif_ac_immed: "2025-02-14",
            ac_ap: [
                { id: 1, type: "ac", description: "Changer rouleau colle" },
                { id: 2, type: "ap", description: "Surveillance hebdomadaire" },
            ],
        },
        {
            id: 11,
            date: "2025-01-20",
            code_article: "ART-011",
            lot: "LOT-80",
            sujet: "Produit oxydé",
            photo_ok: "/images/photo/photok.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            photo_idant: "/images/photo/photoidant.jpg",
            quantite_nc: 22,
            process: "Stockage",
            client: "Client K",
            occurance_defaut: "Rare",
            ac_immed: "Isoler produits",
            date_ac_immed: "2025-01-21",
            date_verif_ac_immed: "2025-01-25",
            ac_ap: [
                { id: 1, type: "ac", description: "Ajouter déshumidificateur" },
                { id: 2, type: "ap", description: "Revoir conditions stockage" },
            ],
        },
        {
            id: 12,
            date: "2024-12-10",
            code_article: "ART-012",
            lot: "LOT-85",
            sujet: "Produit taché",
            photo_ok: "/images/photo/photok.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            photo_idant: "/images/photo/photoidant.jpg",
            quantite_nc: 18,
            process: "Nettoyage",
            client: "Client L",
            occurance_defaut: "Occasionnel",
            ac_immed: "Repeindre / nettoyer",
            date_ac_immed: "2024-12-11",
            date_verif_ac_immed: "2024-12-12",
            ac_ap: [
                { id: 1, type: "ac", description: "Changer solution nettoyage" },
                { id: 2, type: "ap", description: "Contrôle visuel systématique" },
            ],
        },
        {
            id: 13,
            date: "2024-11-22",
            code_article: "ART-013",
            lot: "LOT-90",
            sujet: "Produit mal soudé",
            photo_ok: "/images/photo/photok.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            photo_idant: "/images/photo/photoidant.jpg",
            quantite_nc: 33,
            process: "Soudage",
            client: "Client M",
            occurance_defaut: "Fréquent",
            ac_immed: "Arrêter soudure",
            date_ac_immed: "2024-11-23",
            date_verif_ac_immed: "2024-11-25",
            ac_ap: [
                { id: 1, type: "ac", description: "Changer électrodes" },
                { id: 2, type: "ap", description: "Formation opérateur soudage" },
            ],
        },
        {
            id: 14,
            date: "2024-10-15",
            code_article: "ART-014",
            lot: "LOT-95",
            sujet: "Produit fissuré",
            photo_ok: "/images/photo/photok.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            photo_idant: "/images/photo/photoidant.jpg",
            quantite_nc: 12,
            process: "Moulage",
            client: "Client N",
            occurance_defaut: "Occasionnel",
            ac_immed: "Stopper lot",
            date_ac_immed: "2024-10-16",
            date_verif_ac_immed: "2024-10-18",
            ac_ap: [
                { id: 1, type: "ac", description: "Vérifier moule" },
                { id: 2, type: "ap", description: "Inspection plus fréquente" },
            ],
        },
        {
            id: 15,
            date: "2024-09-05",
            code_article: "ART-015",
            lot: "LOT-100",
            sujet: "Mauvais marquage laser",
            photo_ok: "/images/photo/photok.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            photo_idant: "/images/photo/photoidant.jpg",
            quantite_nc: 45,
            process: "Gravure",
            client: "Client O",
            occurance_defaut: "Rare",
            ac_immed: "Arrêter gravure",
            date_ac_immed: "2024-09-06",
            date_verif_ac_immed: "2024-09-08",
            ac_ap: [
                { id: 1, type: "ac", description: "Nettoyer lentilles laser" },
                { id: 2, type: "ap", description: "Plan maintenance trimestrielle" },
            ],
        },
        {
            id: 16,
            date: "2024-08-12",
            code_article: "ART-016",
            lot: "LOT-110",
            sujet: "Produit mal vissé",
            photo_ok: "/images/photo/photok.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            photo_idant: "/images/photo/photoidant.jpg",
            quantite_nc: 20,
            process: "Assemblage",
            client: "Client P",
            occurance_defaut: "Occasionnel",
            ac_immed: "Reserrer vis",
            date_ac_immed: "2024-08-13",
            date_verif_ac_immed: "2024-08-14",
            ac_ap: [
                { id: 1, type: "ac", description: "Installer tournevis dynamométrique" },
                { id: 2, type: "ap", description: "Former équipe assemblage" },
            ],
        },
        {
            id: 17,
            date: "2024-07-01",
            code_article: "ART-017",
            lot: "LOT-120",
            sujet: "Produit mal poli",
            photo_ok: "/images/photo/photok.jpg",
            photo_nok: "/images/photo/photonk.jpg",
            photo_idant: "/images/photo/photoidant.jpg",
            quantite_nc: 28,
            process: "Polissage",
            client: "Client Q",
            occurance_defaut: "Fréquent",
            ac_immed: "Repolir pièces",
            date_ac_immed: "2024-07-02",
            date_verif_ac_immed: "2024-07-04",
            ac_ap: [
                { id: 1, type: "ac", description: "Changer pâte polissage" },
                { id: 2, type: "ap", description: "Contrôle qualité quotidien" },
            ],
        }
    ]);

    const [selectedRapport, setSelectedRapport] = useState<RapportNC | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const navigate = useNavigate();


    const openModal = (rapport: RapportNC) => {
        setSelectedRapport(rapport);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewAction({ type: "ac", description: "" });
    };

    const [newAction, setNewAction] = useState<{ type: "ac" | "ap"; description: string }>({ type: "ac", description: "" });

    const addAction = () => {
        if (!selectedRapport) return;

        const updatedRapports = rapports.map((r) =>
            r.id === selectedRapport.id
                ? {
                    ...r,
                    ac_ap: [
                        ...r.ac_ap,
                        { id: Date.now(), type: newAction.type, description: newAction.description },
                    ],
                }
                : r
        );

        setRapports(updatedRapports);
        closeModal();
    };

    const deleteRapport = (id: number) => {
        setRapports((prev) => prev.filter((r) => r.id !== id));
    };

    const deleteAction = (rapportId: number, actionId: number) => {
        setRapports((prev) =>
            prev.map((r) =>
                r.id === rapportId ? { ...r, ac_ap: r.ac_ap.filter((a) => a.id !== actionId) } : r
            )
        );
    };

    const handleEdit = (row: RapportNC) => {
        setSelectedRapport(row);
        setIsModalUpdateOpen(true);
    };

    const handleSave = (updatedRapport: RapportNC) => {
        setRapports((prev) =>
            prev.map((r) => (r.id === updatedRapport.id ? updatedRapport : r))
        );
    };

    const getRapportOptions = (row: RapportNC) => [
        {
            label: "Modifier",
            onClick: () => handleEdit(row),
        },
        {
            label: "Supprimer",
            onClick: () => deleteRapport(row.id),
        },
        {
            label: "AC/AP",
            onClick: () => openModal(row),
        },
    ];

    const [filters, setFilters] = useState<Record<string, string>>({
        date: "",
        code_article: "",
        lot: "",
        sujet: "",
        quantite_nc: "",
        process: "",
        client: "",
        occurance_defaut: "",
        ac_immed: "",
        date_ac_immed: "",
        date_verif_ac_immed: "",
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const filterFields = [
        { name: "code_article", placeholder: "Filtrer par Code Article" },
        { name: "lot", placeholder: "Filtrer par Lot" },
        { name: "sujet", placeholder: "Filtrer par Sujet" },
        { name: "process", placeholder: "Filtrer par Process" },
        { name: "client", placeholder: "Filtrer par Client" },
        { name: "occurance_defaut", placeholder: "Filtrer par Occurence" },

    ];
    
    // Fonction pour filtrer les rapports
    const filteredRapports = rapports.filter((r) => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value) return true; // si pas de filtre → garder
            const fieldValue = String(r[key as keyof RapportNC] ?? "").toLowerCase();
            return fieldValue.includes(value.toLowerCase());
        });
    });
    /////////

    const columns: Column<RapportNC>[] = [
        { name: "Date Création", selector: (row) => row.date, sortable: true },
        { name: "Code Article", selector: (row) => row.code_article, sortable: true },
        { name: "N° Lot/date ", selector: (row) => row.lot, sortable: true },
        {
            name: "Photos",
            cell: (row) => (
                <ImageCarousel
                    images={[
                        { src: row.photo_ok ?? "", alt: "Photo OK", caption: "Photo OK" },
                        { src: row.photo_nok ?? "", alt: "Photo Non OK", caption: "Photo Non OK" },
                        { src: row.photo_idant ?? "", alt: "Photo Identité", caption: "Photo Identité" },
                    ]}
                />
            ),
        },
        { name: "Quantité NC", selector: (row) => row.quantite_nc, sortable: true },
        { name: "Process", selector: (row) => row.process, sortable: true },
        { name: "Nom Client", selector: (row) => row.client, sortable: true },
        {
            name: "Sujet",
            cell: (row) => (
                <ModalPreview
                    label={row.sujet}
                    title="Sujet"
                    content={row.sujet}
                    maxLength={20}
                />
            ),
        },
        { name: "Occurance Défaut", selector: (row) => row.occurance_defaut, sortable: true },
        {
            name: "Action Immédiate",
            cell: (row) => (
                <ModalPreview
                    label={row.ac_immed}
                    title="Action Immédiate"
                    content={row.ac_immed}
                    maxLength={20}
                />
            ),
        },
        { name: "Date Action Immédiate", selector: (row) => row.date_ac_immed, sortable: true },
        { name: "Date vérification Action Immédiate", selector: (row) => row.date_verif_ac_immed, sortable: true },

        {
            name: "Actions & (AC/AP)",
            cell: (row) => <ActionMenu options={getRapportOptions(row)} />,
        },
    ];

    return (
        <>
            <PageMeta title="Rapport Non Conformité" description="Gestion des rapports NC" />
            <PageBreadcrumb pageTitle="Rapport Non Conformité" />
            <button
                onClick={() => navigate("/rapport-nc/add-rnc")}
                className="px-3 py-3 my-3 text-xs text-white bg-blue-500 rounded hover:bg-blue-700 hover:shadow-xl transition-shadow duration-200"
            >
                Ajouter un Rapport NC
            </button>
            <div className="grid grid-cols-1 gap-6 ">
                <DynamicFilters filters={filters} onFilterChange={handleFilterChange} fields={filterFields} />
                <DataTableLayout
                    title="Liste des Rapports de non Conformité"
                    columns={columns}
                    data={filteredRapports}
                />
            </div>
            <EditRapportNcModal
                isOpen={isModalUpdateOpen}
                onClose={() => setIsModalUpdateOpen(false)}
                rapportnc={selectedRapport}
                onSave={handleSave}
            />
            <Modal isOpen={isModalOpen} onClose={closeModal} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Actions Correctives / Préventives (Rapport {selectedRapport?.id})
                        </h4>
                        <ul className="mb-4">
                            {selectedRapport?.ac_ap.map((a) => (
                                <li key={a.id} className="flex justify-between items-center border-b py-2 dark:text-white/90">
                                    <span>
                                        <strong>{a.type.toUpperCase()}</strong> – {a.description}
                                    </span>
                                    <button
                                        className="px-2 py-1 text-xs rounded bg-red-500 text-white"
                                        onClick={() => deleteAction(selectedRapport.id, a.id)}
                                    >
                                        Supprimer
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col gap-2">
                            <select
                                value={newAction.type}
                                onChange={(e) => setNewAction({ ...newAction, type: e.target.value as "ac" | "ap" })}
                                className="border px-2 py-1 rounded dark:text-white/40"
                            >
                                <option value="ac" className="dark:text-dark">Action Corrective</option>
                                <option value="ap" className="dark:text-dark">Action Préventive</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Description"
                                value={newAction.description}
                                onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                                className="border px-2 py-1 rounded dark:text-white/90"
                            />
                            <button className="px-3 py-1 rounded bg-green-500 text-white" onClick={addAction}>
                                Ajouter
                            </button>
                        </div>

                        <button className="mt-4 text-sm dark:bg-white/60 px-2 py-1 rounded dark:hover:bg-white/40" onClick={closeModal}>
                            Fermer
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
