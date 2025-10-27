import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import PageMeta from "../common/PageMeta";
import GoBackButton from "../../utils/GoBack";
import PageBreadcrumb from "../common/PageBreadCrumb";
import ComponentCard from "../common/ComponentCard";
import FileInput from "../form/input/FileInput";
import { ClientService } from "../../services/ClientService";
import { Client } from "../../types/Client";
import { Suivifournisseur } from "../../types/Suivifournisseur";
import { Article } from "../../types/Articles";
import { ArticleService } from "../../services/ArticleService";
import { SuiviFournisseurService } from "../../services/SuiviFournissuerService";
import { validateForm } from "./Validation";
import { SuiviClientService } from "../../services/SuiviDefautClientService";


export default function AddSuiviClientForm() {
    const [clients, setclients] = useState<Client[]>([]);
    const [Articles, setArticles] = useState<Article[]>([]);
    const [SuiviFournisseur, setSuiviFournisseur] = useState<Suivifournisseur[]>([]);
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<any>({});
    const [user, setUser] = useState<any>(null);

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
        const userData = localStorage.getItem("userData");
        const storedUser = userData ? JSON.parse(userData) : null;
        console.log(storedUser);
        if (storedUser) {
            setUser(storedUser);
        }
        fetchData();
    }, []);

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
                    if (value instanceof Blob) {
                        formDataToSend.append(key, value);
                    } else {
                        formDataToSend.append(key, String(value));
                    }
                }
            });

            formDataToSend.append("id_user", String(user.id_user));



            // 🧩 Vérification avant l’envoi
            for (let [key, value] of formDataToSend.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await SuiviClientService.createSuviClient(formDataToSend);
            console.log("Rapport créé :", response.data);

            swal({
                title: "Succès !",
                text: "Le Suivi Client a été ajouté avec succès.",
                icon: "success",
            }).then(() => {
                window.location.href = "/suivi-client";
            });

        } catch (err) {
            console.error(err);
            swal({
                title: "Erreur !",
                text: "Impossible d'ajouter le Suivi Client !",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
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



    return (
        <div>
            <PageMeta
                title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <div className="flex items-center justify-between mb-1">
                <GoBackButton />
                <PageBreadcrumb pageTitle="" />
            </div>
            <ComponentCard title="Ajouter un Suivi Incident Client">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mr-4">
                    <div>
                        <Label htmlFor="num_rec_cli">N° reclamation client</Label>
                        <Input
                            type="text"
                            id="num_rec_cli"
                            name="num_rec_cli"
                            error={!!errors.num_rec_cli}
                            success={!!formData.num_rec_cli}
                            onChange={handleChange}
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
                        />
                        {errors.ref && <p className="text-red-500 text-sm">{errors.ref}</p>}
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
                        />
                        {errors.nom_projet && <p className="text-red-500 text-sm">{errors.nom_projet}</p>}
                    </div>
                    <div>
                        <Label>phase de projet</Label>
                        <Select
                            options={optionsPhaseProjet}
                            placeholder="Sélectionner une Phase"
                            onChange={(val) => handleSelectChange(val, "phase_projet")}
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
                        />
                        {errors.nbr_piec_ko && <p className="text-red-500 text-sm">{errors.nbr_piec_ko}</p>}
                    </div>
                    <div>
                        <Label>Type incident </Label>
                        <Select
                            options={OptionsTypeincident}
                            placeholder="Sélectionner un type"
                            onChange={(val) => handleSelectChange(val, "type_incidant")}
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
                        />
                        {errors.nom_client && <p className="text-red-500 text-sm">{errors.nom_client}</p>}
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
                        />
                        {errors.cout_non_quat_s_rec && <p className="text-red-500 text-sm">{errors.cout_non_quat_s_rec}</p>}
                    </div>
                    <div>
                        <Label>Statut </Label>
                        <Select
                            options={optionsStatut}
                            placeholder="Sélectionner une statut"
                            onChange={(val) => handleSelectChange(val, "statut")}
                        />
                        {errors.statut && <p className="text-red-500 text-sm">{errors.statut}</p>}
                    </div>
                </div>
                <div className="flex items-center justify-center mt-6">
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
            </ComponentCard>
        </div>
    );
}