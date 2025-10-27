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
import { FournisseurService } from "../../services/FournisseurService";
import { ArticleService } from "../../services/ArticleService";
import { Fournisseur } from "../../types/Fournisseur";
import { Article } from "../../types/Articles";
import { handleFileChange } from "../SuiviSuperControle/handleFilechange";
import { SuiviFournisseurService } from "../../services/SuiviFournissuerService";
import { validateForm } from "./Validation";


export default function AddSuiviFournisseurForm() {

    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const [Articles, setArticles] = useState<Article[]>([]);
    const [Fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [dataArticles, dataFournisseures] = await Promise.all([
                ArticleService.getArticles(),
                FournisseurService.getFournisseur(),
            ]);
            if (Array.isArray(dataArticles)) setArticles(dataArticles);
            if (Array.isArray(dataFournisseures)) setFournisseurs(dataFournisseures);
        } catch (err) {
            console.error(err);
            console.log("Erreur lors du chargement des données.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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

    const optionsClassification = [
        { value: "C1", label: "C1" },
        { value: "C2", label: "C2" },
        { value: "C3", label: "C3" },

    ];

    const optionsOUINON = [
        { value: "Oui", label: "Oui" },
        { value: "Non", label: "Non" },
    ];

    const optionsDecision = [
        { value: "Retour Production", label: "Retour Production" },
        { value: "Reworker", label: "Reworker" },
        { value: "Retour Fournisseur", label: "Retour Fournisseur" },
        { value: "Mise au Rebut", label: "Mise au Rebut" },
    ];

    const optionsStatut = [
        { value: "Ouvert", label: "Ouvert" },
        { value: "En cours", label: "En cours" },
        { value: "Clôturé", label: "Clôturé" },
        { value: "Annulé", label: "Annulé" },
    ];

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const isValid = validateForm(formData, setErrors);
        if (!isValid) return;

        setLoading(true);
        try {
            const formDataToSend = new FormData();

            formDataToSend.append("code_artc", formData.code_artc || "");
            formDataToSend.append("nom_fournisseur", formData.nom_fournisseur || "");
            formDataToSend.append("class", formData.class || "");
            formDataToSend.append("desc_prob", formData.desc_prob || "");
            formDataToSend.append("pcs_ko_detecte", formData.pcs_ko_detecte || "");
            formDataToSend.append("triage", formData.triage || "");
            formDataToSend.append("tot_pcs_ko", formData.tot_pcs_ko || "");
            formDataToSend.append("decision", formData.decision || "");
            formDataToSend.append("derogation", formData.derogation || "");
            formDataToSend.append("cout_tret", formData.cout_tret || "");
            formDataToSend.append("statut", formData.statut || "");
            formDataToSend.append("notes", formData.notes || "");
            if (formData.piece_joint) formDataToSend.append("piece_joint", formData.piece_joint);


            for (let [key, value] of formDataToSend.entries()) {
                console.log(key, value);
            }
            const response = await SuiviFournisseurService.createSuiviFournisseur(formDataToSend);

            console.log("Utilisateur créé :", response.data);
            swal({
                title: "Good job!",
                text: "Le suivi Fournisseur a été ajouté avec succès.",
                icon: "success",
            }).then(() => {
                window.location.href = "/suivi-fournisseur";
            });
        } catch (err) {
            console.error(err);
            swal({
                title: "Erreur!",
                text: "Impossible d'ajouter le suivi fournisseur.",
                icon: "error",
            });
        } finally {
            setLoading(false);
        }
    };




    return (
        <div>
            <PageMeta
                title="Ajouter Suivi Fournisseur"
                description="Interface permet de ajouter un suivi des fournisseurs"
            />
            <div className="flex items-center justify-between mb-1">
                <GoBackButton />
                <PageBreadcrumb pageTitle="" />
            </div>
            <ComponentCard title="Ajouter un Suivi Defaut Fournisseur">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mr-4">
                    <div>
                        <Label>Code Article</Label>
                        <Select
                            options={Articles.length > 0
                                ? Articles.map(dep => ({ value: String(dep.id_article), label: dep.code_artc }))
                                : [{ value: "", label: "Aucun articel disponible" }]
                            }
                            placeholder={loading ? "Chargement..." : "Sélectionner"}
                            onChange={(val) => handleSelectChange(val, "code_artc")}
                        />
                        {errors.code_artc && <p className="text-red-500 text-sm">{errors.code_artc}</p>}
                    </div>
                    <div>
                        <Label>Fournisseur</Label>
                        <Select
                            options={Fournisseurs.length > 0
                                ? Fournisseurs.map(dep => ({ value: String(dep.id_fournisseur), label: dep.nom_fournisseur }))
                                : [{ value: "", label: "Aucun fournisseurs disponible" }]
                            }
                            placeholder={loading ? "Chargement..." : "Sélectionner"}
                            onChange={(val) => handleSelectChange(val, "nom_fournisseur")}
                        />
                        {errors.nom_fournisseur && <p className="text-red-500 text-sm">{errors.nom_fournisseur}</p>}
                    </div>
                    <div>
                        <Label>Classification</Label>
                        <Select
                            options={optionsClassification}
                            placeholder="Sélectionner la classification"
                            onChange={(val) => handleSelectChange(val, "class")}
                        />
                        {errors.class && <p className="text-red-500 text-sm">{errors.class}</p>}
                    </div>
                    <div>
                        <Label htmlFor="desc_prob">Description de problème</Label>
                        <Input
                            type="text"
                            id="desc_prob"
                            name="desc_prob"
                            error={!!errors.desc_prob}
                            success={!!formData.desc_prob}
                            onChange={handleChange}
                        />
                        {errors.desc_prob && <p className="text-red-500 text-sm">{errors.desc_prob}</p>}
                    </div>
                    <div>
                        <Label htmlFor="pcs_ko_detecte">Pcs KO détectées </Label>
                        <Input
                            type="number"
                            id="pcs_ko_detecte"
                            name="pcs_ko_detecte"
                            error={!!errors.pcs_ko_detecte}
                            success={!!formData.pcs_ko_detecte}
                            onChange={handleChange}
                        />
                        {errors.pcs_ko_detecte && <p className="text-red-500 text-sm">{errors.pcs_ko_detecte}</p>}
                    </div>
                    <div>
                        <Label>TRIAGE (Oui/Non) </Label>
                        <Select
                            options={optionsOUINON}
                            placeholder="Sélectionner Triage"
                            onChange={(val) => handleSelectChange(val, "triage")}
                        />
                        {errors.triage && <p className="text-red-500 text-sm">{errors.triage}</p>}
                    </div>
                    <div>
                        <Label htmlFor="tot_pcs_ko"> Total des pcs KO </Label>
                        <Input
                            type="number"
                            id="tot_pcs_ko"
                            name="tot_pcs_ko"
                            error={!!errors.tot_pcs_ko}
                            success={!!formData.tot_pcs_ko}
                            onChange={handleChange}
                        />
                        {errors.tot_pcs_ko && <p className="text-red-500 text-sm">{errors.tot_pcs_ko}</p>}
                    </div>
                    <div>
                        <Label>Décision</Label>
                        <Select
                            options={optionsDecision}
                            placeholder="Sélectionner le Décision"
                            onChange={(val) => handleSelectChange(val, "decision")}
                        />
                        {errors.decision && <p className="text-red-500 text-sm">{errors.decision}</p>}
                    </div>
                    <div>
                        <Label>Dérogation (Oui/Non)</Label>
                        <Select
                            options={optionsOUINON}
                            placeholder="Sélectionner Dérogation"
                            onChange={(val) => handleSelectChange(val, "derogation")}
                        />
                        {errors.derogation && <p className="text-red-500 text-sm">{errors.derogation}</p>}
                    </div>
                    <div>
                        <Label htmlFor="cout_tret">Coût De traitement </Label>
                        <Input
                            type="number"
                            id="cout_tret"
                            name="cout_tret"
                            error={!!errors.cout_tret}
                            success={!!formData.cout_tret}
                            onChange={handleChange}
                        />
                        {errors.cout_tret && <p className="text-red-500 text-sm">{errors.cout_tret}</p>}
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
                    <div>
                        <Label htmlFor="notes">notes</Label>
                        <Input
                            type="text"
                            id="notes"
                            name="notes"
                            error={!!errors.notes}
                            success={!!formData.notes}
                            onChange={handleChange}
                        />
                        {errors.notes && <p className="text-red-500 text-sm">{errors.notes}</p>}
                    </div>
                    <div>
                        <Label>Piéces jointe </Label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx,.csv"
                            onChange={(e) => handleFileChange(e, "piece_joint", setFormData, setErrors)}
                            className="w-full border border-gray-300 rounded-md p-2 dark:text-white/70"
                        />
                        {/*Affichage du nom du fichier sélectionné */}
                        {formData.piece_joint && (
                            <p className="text-green-600 mt-1 text-sm">
                                ✅ Fichier sélectionné :{" "}
                                <b>{formData.piece_joint.name}</b>
                            </p>
                        )}
                        {/* Affichage de l’erreur */}
                        {errors.piece_joint && (
                            <p className="text-red-500 text-sm">{errors.piece_joint}</p>
                        )}
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