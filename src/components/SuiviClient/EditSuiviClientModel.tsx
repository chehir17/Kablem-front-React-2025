import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import FileInput from "../form/input/FileInput";
import { Modal } from "../ui/modal";
import DataTable from "react-data-table-component";
import { SuiviDefautClient } from "../../types/SuiviDefautclient";
import { Client } from "../../types/Client";
import { Article } from "../../types/Articles";
import { Suivifournisseur } from "../../types/Suivifournisseur";
import { ArticleService } from "../../services/ArticleService";
import { ClientService } from "../../services/ClientService";
import { SuiviFournisseurService } from "../../services/SuiviFournissuerService";
import { validateForm } from "./Validation";
import { SuiviClientService } from "../../services/SuiviDefautClientService";


interface EditSuiviClientModelProps {
    isOpen: boolean;
    onClose: () => void;
    suiviclient: SuiviDefautClient | null;
    onSave: (updatesuiviclient: SuiviDefautClient) => void;
}

export default function EditSuiviClientModel({
    isOpen,
    onClose,
    suiviclient,
    onSave
}: EditSuiviClientModelProps) {

    const [formData, setFormData] = useState({
        id_suiviclient: 0,
        num_rec_cli: "",
        date_rec_cli: new Date(""),
        zone: "",
        nom_client: null as string | null,
        ref: null as string | null,
        nom_projet: "",
        phase_projet: "",
        desc_deff: "",
        photo_ok: "",
        photo_nok: "",
        nbr_piec_ko: "",
        type_incidant: "",
        id_suivifournisseur: "",
        recurence: "",
        statut: "",
        cout_non_quat_s_rec: "",
        id_user: 0,
    });
    const [clients, setclients] = useState<Client[]>([]);
    const [Articles, setArticles] = useState<Article[]>([]);
    const [SuiviFournisseur, setSuiviFournisseur] = useState<Suivifournisseur[]>([]);
    const [user, setUser] = useState<any>(null);
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [dataArticles, dataClients, dataSuivifournisseur] = await Promise.all([
                ArticleService.getArticles(),
                ClientService.getClient(),
                SuiviFournisseurService.getSuiviFournisseur(),
            ]);
            if (Array.isArray(dataArticles)) setArticles(dataArticles);
            if (Array.isArray(dataClients)) setclients(dataClients);
            if (Array.isArray(dataSuivifournisseur)) setSuiviFournisseur(dataSuivifournisseur);
        } catch (err) {
            console.error(err);
            console.log("Erreur lors du chargement des données.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (suiviclient) {
            setFormData(suiviclient);
        }
        fetchData();
        // fetch user data
        const userData = localStorage.getItem("userData");
        const storedUser = userData ? JSON.parse(userData) : null;
        console.log(storedUser);
        if (storedUser) {
            setUser(storedUser);
        }
    }, [suiviclient]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setErrors({ ...errors, [e.target.id]: "" });
    };

    const handleSelectChange = (
        option: { value: string; label: string } | string,
        field: string
    ) => {
        const value = typeof option === "string" ? option : option?.value;
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: "" });
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setErrors((prev: any) => ({ ...prev, [field]: "Le fichier doit être une image." }));
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setErrors((prev: any) => ({ ...prev, [field]: "La taille du fichier doit être inférieure à 2 Mo." }));
                return;
            }
            setFormData((prev: any) => ({ ...prev, [field]: file }));
            setErrors((prev: any) => ({ ...prev, [field]: "" }));
        }
    };


    const optionsZone = [
        { value: "P1", label: "P1" },
        { value: "P2", label: "P2" },
        { value: "P3", label: "P3" },
        { value: "P1 + P2", label: "P1 + P2" },
        { value: "P1 + P2 + P3", label: "P1 + P2 + P3" },
        { value: "CET", label: "CET" },
        { value: "Magasin", label: "Magasin" },
        { value: "P3-1", label: "P3-1" },
        { value: "P3-2", label: "P3-2" },
        { value: "P3-3", label: "P3-3" },
        { value: "Usine", label: "Usine" },
    ];

    const optionsPhaseProjet = [
        { value: "Fabrication", label: "Fabrication" },
        { value: "Montage", label: "Montage" },
        { value: "Inspection", label: "Inspection" },
        { value: "Livraison", label: "Livraison" },
    ];

    const OptionsTypeincident = [
        { value: "Type de Incident", label: "Type de Incident" },
        { value: "Réclamation interne group", label: "Réclamation interne group" },
        { value: "alerte", label: "alerte" },
        { value: "Réclamation client", label: "Réclamation client" },
        { value: "Prototypes", label: "Prototypes" },
    ]

    const optionsStatut = [
        { value: "Ouvert", label: "Ouvert" },
        { value: "En cours", label: "En cours" },
        { value: "Clôturé", label: "Clôturé" },
        { value: "Annulé", label: "Annulé" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isValid = validateForm(formData, setErrors);
        if (!isValid) return;

        if (!user || !user.id_user) {
            swal({
                title: "Erreur utilisateur",
                text: "Impossible d'identifier l'utilisateur connecté.",
                icon: "error",
            });
            return;
        }

        setLoading(true);

        try {
            const formDataToSend = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    console.log(`Ajout à FormData → ${key}:`, value);
                    if (value instanceof Blob) {
                        formDataToSend.append(key, value);
                    } else {
                        formDataToSend.append(key, String(value));
                    }
                }
            });
            formDataToSend.append("id_user", String(user.id_user));

            const response = await SuiviClientService.update(suiviclient!.id_suiviclient, formDataToSend);
            console.log("Rapport créé :", response.data);

            swal({
                title: "Succès !",
                text: "Le suivi client a été Modifié avec succès.",
                icon: "success",
            }).then(() => {
                window.location.href = "/suivi-client";
            });

        } catch (err) {
            console.error(err);
            swal({
                title: "Erreur !",
                text: "Impossible de modifié le Suivi Client !",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };


    return (


        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[1000px] mt-70">
            <div className="no-scrollbar relative w-full max-w-[1000px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    {suiviclient ? `Modifier Suivi Client N° ${suiviclient.id_suiviclient}` : "Modifier"}
                </h4>
                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <div className="custom-scrollbar h-auto overflow-y-auto px-2 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mr-5 mb-2">
                            <div>
                                <Label htmlFor="num_rec_cli">N° reclamation client</Label>
                                <Input
                                    type="text"
                                    id="num_rec_cli"
                                    name="num_rec_cli"
                                    error={!!errors.num_rec_cli}
                                    success={!!formData.num_rec_cli}
                                    onChange={handleChange}
                                    value={formData.num_rec_cli}
                                />
                                {errors.num_rec_cli && <p className="text-red-500 text-sm">{errors.num_rec_cli}</p>}
                            </div>
                            <div className="">
                                <DatePicker
                                    id="date_rec_cli"
                                    label="Date reclamation client"
                                    placeholder="Sélectionner une date"
                                    onChange={(dates) => {
                                        const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                        setFormData((prev: any) => ({
                                            ...prev,
                                            date_rec_cli: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
                                        }));
                                    }}
                                />
                                {errors.date_rec_cli && <p className="text-red-500 text-sm">{errors.date_rec_cli}</p>}
                            </div>
                            <div>
                                <Label>Zone</Label>
                                <Select
                                    options={optionsZone}
                                    placeholder="Sélectionner une Zone"
                                    onChange={(val) => handleSelectChange(val, 'zone')}
                                    value={formData.zone}
                                />
                                {errors.zone && <p className="text-red-500 text-sm">{errors.zone}</p>}
                            </div>
                            <div>
                                <Label>Réf(code-produit)</Label>
                                <Select
                                    options={Articles.length > 0
                                        ? Articles.map(dep => ({ value: String(dep.id_article), label: dep.code_artc }))
                                        : [{ value: "", label: "Aucun article disponible" }]
                                    }
                                    placeholder={loading ? "Chargement..." : "Sélectionner"}
                                    onChange={(val) => handleSelectChange(val, "ref")}
                                    value={formData.ref || ""}
                                />
                                {errors.id_article && <p className="text-red-500 text-sm">{errors.id_article}</p>}
                            </div>
                            <div>
                                <Label>Projet</Label>
                                <Input
                                    type="text"
                                    id="nom_projet"
                                    name="nom_projet"
                                    error={!!errors.nom_projet}
                                    success={!!formData.nom_projet}
                                    onChange={handleChange}
                                    value={formData.nom_projet}
                                />
                                {errors.nom_projet && <p className="text-red-500 text-sm">{errors.nom_projet}</p>}
                            </div>
                            <div>
                                <Label>phase de projet</Label>
                                <Select
                                    options={optionsPhaseProjet}
                                    placeholder="Sélectionner une Phase"
                                    onChange={(val) => handleSelectChange(val, "phase_projet")}
                                    value={formData.phase_projet}
                                />
                                {errors.phase_projet && <p className="text-red-500 text-sm">{errors.phase_projet}</p>}
                            </div>
                            <div>
                                <Label htmlFor="desc_deff">Description du défaut</Label>
                                <Input
                                    type="text"
                                    id="desc_deff"
                                    name="desc_deff"
                                    error={!!errors.desc_deff}
                                    success={!!formData.desc_deff}
                                    onChange={handleChange}
                                    value={formData.desc_deff}
                                />
                                {errors.desc_deff && <p className="text-red-500 text-sm">{errors.desc_deff}</p>}
                            </div>
                            <div>
                                <Label>Photo OK</Label>
                                <FileInput onChange={(e) => handleFileChange(e, "photo_ok")} className="w-full" />
                                {errors.photo_ok && <p className="text-red-500 text-sm">{errors.photo_ok}</p>}
                            </div>
                            <div>
                                <Label>Photo Non Ok</Label>
                                <FileInput onChange={(e) => handleFileChange(e, "photo_nok")} className="w-full" />
                                {errors.photo_nok && <p className="text-red-500 text-sm">{errors.photo_nok}</p>}
                            </div>
                            <div>
                                <Label htmlFor="nbr_piec_ko">nombre piéce KO</Label>
                                <Input
                                    type="number"
                                    id="nbr_piec_ko"
                                    name="nbr_piec_ko"
                                    error={!!errors.nbr_piec_ko}
                                    success={!!formData.nbr_piec_ko}
                                    onChange={handleChange}
                                    value={formData.nbr_piec_ko}
                                />
                                {errors.nbr_piec_ko && <p className="text-red-500 text-sm">{errors.nbr_piec_ko}</p>}
                            </div>
                            <div>
                                <Label>Type incident </Label>
                                <Select
                                    options={OptionsTypeincident}
                                    placeholder="Sélectionner un type"
                                    onChange={(val) => handleSelectChange(val, "type_incidant")}
                                    value={formData.type_incidant}
                                />
                                {errors.type_incidant && <p className="text-red-500 text-sm">{errors.type_incidant}</p>}
                            </div>
                            <div>
                                <Label>Numéro Reclamation fournisseur </Label>
                                <Select
                                    options={SuiviFournisseur.length > 0
                                        ? SuiviFournisseur.map(dep => ({ value: String(dep.id_suivifournisseur), label: 'Reclamation N° ' + dep.id_suivifournisseur.toString() }))
                                        : [{ value: "", label: "Aucun suivi fournisseur disponible" }]
                                    }
                                    placeholder={loading ? "Chargement..." : "Sélectionner"}
                                    onChange={(val) => handleSelectChange(val, "id_suivifournisseur")}
                                    value={formData.id_suivifournisseur}
                                />
                                {errors.id_suivifournisseur && <p className="text-red-500 text-sm">{errors.id_suivifournisseur}</p>}
                            </div>
                            <div>
                                <Label>Clients </Label>
                                <Select
                                    options={clients.length > 0
                                        ? clients.map(dep => ({ value: String(dep.id_client), label: dep.nom_client }))
                                        : [{ value: "", label: "Aucun client disponible" }]
                                    }
                                    placeholder={loading ? "Chargement..." : "Sélectionner"}
                                    onChange={(val) => handleSelectChange(val, "nom_client")}
                                    value={formData.nom_client || ""}
                                />
                                {errors.id_client && <p className="text-red-500 text-sm">{errors.id_client}</p>}
                            </div>
                            <div>
                                <Label htmlFor="recurence">Recurence</Label>
                                <Input
                                    type="text"
                                    id="recurence"
                                    name="recurence"
                                    error={!!errors.recurence}
                                    success={!!formData.recurence}
                                    onChange={handleChange}
                                    value={formData.recurence}
                                />
                                {errors.recurence && <p className="text-red-500 text-sm">{errors.recurence}</p>}
                            </div>
                            <div>
                                <Label htmlFor="cout_non_quat_s_rec">CNQ</Label>
                                <Input
                                    type="number"
                                    id="cout_non_quat_s_rec"
                                    name="cout_non_quat_s_rec"
                                    error={!!errors.cout_non_quat_s_rec}
                                    success={!!formData.cout_non_quat_s_rec}
                                    onChange={handleChange}
                                    value={formData.cout_non_quat_s_rec}
                                />
                                {errors.cout_non_quat_s_rec && <p className="text-red-500 text-sm">{errors.cout_non_quat_s_rec}</p>}
                            </div>
                            <div>
                                <Label>Statut </Label>
                                <Select
                                    options={optionsStatut}
                                    placeholder="Sélectionner une statut"
                                    onChange={(val) => handleSelectChange(val, "statut")}
                                    value={formData.statut}
                                />
                                {errors.statut && <p className="text-red-500 text-sm">{errors.statut}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className={`px-6 py-2 text-sm text-white rounded-lg shadow-md transition ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            disabled={loading}
                        >
                            {loading ? "⏳ Enregistrement..." : "Sauvegarder"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}