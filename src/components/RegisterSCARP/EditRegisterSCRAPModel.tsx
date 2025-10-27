import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import DatePicker from "../form/date-picker";
import { registreSCRAP } from "../../types/registreSCRAP";
import { ArticleService } from "../../services/ArticleService";
import { Ligne } from "../../types/Ligne";
import { Article } from "../../types/Articles";
import { LigneService } from "../../services/LigneService";
import { UserService } from "../../services/UserService";
import { LotService } from "../../services/LotService";
import { Utilisateur } from "../../types/Utilisateur";
import { Lot } from "../../types/Lot";
import { SCRAPService } from "../../services/SCRAPService";

interface EditRegisterSCRAPModelProps {
    isOpen: boolean;
    onClose: () => void;
    registerscraps: registreSCRAP | null;
    onSave: (updatedRegistscrap: registreSCRAP) => void;
}

export default function EditRegisterSCRAPModel({
    isOpen,
    onClose,
    registerscraps,
    onSave,
}: EditRegisterSCRAPModelProps) {

    const [formData, setFormData] = useState({
        id_scrap: 0,
        zone_affe_prob: "",
        annulation: "",
        desc_prob: "",
        cout_unit: "",
        machine: "",
        Desc_acmo: "",
        mini: "",
        table_elec: "",
        qnt_scrap: "",
        valeur_scrap: "",
        cause_prob: "",
        classification_cause: "",
        ac_immed_prend: "",
        rebut_remplacer: "",
        N_pecRec: 0,
        qnt_rebF: "",
        h_interne: "",
        h_externe: "",
        cout_final: "",
        res_pos: "",
        ac_corr_suppl: "",
        N_ac_corr_ex: "",
        note: "",
        poids_rebut: "",
        id_ligne: "",
        compilateur: "",
        id_lot: "",
        date_production: new Date(),
        id_article: "",
        odl_rep: "",
        new_odl: "",
        level: "",
        oper_1: "",
        created_at: new Date(),

    });

    useEffect(() => {
        if (registerscraps) {
            setFormData(registerscraps);
        }
    }, [registerscraps]);
    const [Lignes, setLignes] = useState<Ligne[]>([]);
    const [Articles, setArticles] = useState<Article[]>([]);
    const [Users, setUsers] = useState<Utilisateur[]>([]);
    const [lots, setLots] = useState<Lot[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<any>({});

    const fetchData = async () => {
        try {
            const [dataArticles, dataLignes, dataUsers, dataLots] = await Promise.all([
                ArticleService.getArticles(),
                LigneService.getLigne(),
                UserService.getUsers(),
                LotService.getLot(),
            ]);
            if (Array.isArray(dataArticles)) setArticles(dataArticles);
            if (Array.isArray(dataUsers)) setUsers(dataUsers);
            if (Array.isArray(dataLignes)) setLignes(dataLignes);
            if (Array.isArray(dataLots)) setLots(dataLots);

        } catch (err) {
            console.error(err);
            console.log("Erreur lors du chargement des données.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [])



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

    const handleSubmit = async () => {
        console.log(formData)
        try {
            setLoading(true);
            const updated = await SCRAPService.updateSCRAP(formData.id_scrap, formData);
            console.log("registre scrap est mis à jour :", updated);
            onSave(updated);
            onClose();
            swal({
                title: "succès !",
                text: "Le registre scrap est à jour !",
                icon: "success",
            })

            window.location.reload();
        } catch (error) {
            swal({
                title: "Erreur !",
                text: "❌ Erreur lors de la mise à jour de registre scrap !",
                icon: "error",
            })
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const optionsZoneProb = [
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

    const optionsAnnulation = [
        { value: "oui", label: "Oui" },
        { value: "non", label: "Non" },
    ];

    const optionsLevel = [
        { value: "High Level", label: "High Level" },
        { value: "Medium Level", label: "Medium Level" },
    ];

    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose} className="max-w-[1250px] m-2 mt-70">
                <div className="no-scrollbar relative w-full max-w-[1250px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Modifier Registre SCRAP N°{formData.id_scrap}
                    </h4>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-auto overflow-y-auto px-2 mb-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                <div>
                                    <Label>compilateur</Label>
                                    <Select
                                        options={Users.length > 0
                                            ? Users.map(dep => ({ value: String(dep.id_user), label: dep.first_name + ' ' + dep.last_name }))
                                            : [{ value: "", label: "Aucun Utilisateur disponible" }]
                                        }
                                        placeholder={loading ? "Chargement..." : "Sélectionner"}
                                        onChange={(val) => handleSelectChange(val, "compilateur")}
                                        value={formData.compilateur}
                                    />
                                    {errors.compilateur && <p className="text-red-500 text-sm">{errors.compilateur}</p>}
                                </div>
                                <div>
                                    <Label>Zone de probléme</Label>
                                    <Select
                                        options={optionsZoneProb}
                                        placeholder="Sélectionner une zone"
                                        onChange={(val) => handleSelectChange(val, "zone_affe_prob")}
                                        value={formData.zone_affe_prob}
                                    />
                                    {errors.zone_affe_prob && <p className="text-red-500 text-sm">{errors.zone_affe_prob}</p>}
                                </div>
                                <div>
                                    <Label>Annulation</Label>
                                    <Select
                                        options={optionsAnnulation}
                                        placeholder="Sélectionner un code"
                                        onChange={(val) => handleSelectChange(val, "annulation")}
                                        value={formData.annulation}
                                    />
                                    {errors.annulation && <p className="text-red-500 text-sm">{errors.annulation}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="desc_prob">description de probléme</Label>
                                    <Input
                                        type="text"
                                        id="desc_prob"
                                        name="desc_prob"
                                        error={!!errors.desc_prob}
                                        success={!!formData.desc_prob}
                                        onChange={handleChange}
                                        value={formData.desc_prob}
                                    />
                                    {errors.desc_prob && <p className="text-red-500 text-sm">{errors.desc_prob}</p>}
                                </div>
                                <div className="">
                                    <DatePicker
                                        id="date_production"
                                        label="Date de production "
                                        placeholder="Sélectionner une date"
                                        onChange={(dates) => {
                                            const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                            setFormData((prev: any) => ({
                                                ...prev,
                                                date_production: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
                                            }));
                                        }}
                                    />
                                    {errors.date_production && <p className="text-red-500 text-sm">{errors.date_production}</p>}
                                </div>
                                <div>
                                    <Label>Code Produit</Label>
                                    <Select
                                        options={Articles.length > 0
                                            ? Articles.map(dep => ({ value: String(dep.id_article), label: dep.code_artc }))
                                            : [{ value: "", label: "Aucun article disponible" }]
                                        }
                                        placeholder={loading ? "Chargement..." : "Sélectionner"}
                                        onChange={(val) => handleSelectChange(val, "id_article")}
                                        value={formData.id_article}
                                    />
                                    {errors.id_article && <p className="text-red-500 text-sm">{errors.id_article}</p>}
                                </div>
                                <div>
                                    <Label>Opérateure 1</Label>
                                    <Select
                                        options={Users.length > 0
                                            ? Users.map(dep => ({ value: String(dep.id_user), label: dep.first_name + ' ' + dep.last_name }))
                                            : [{ value: "", label: "Aucun utilisateur disponible" }]
                                        }
                                        placeholder={loading ? "Chargement..." : "Sélectionner"}
                                        onChange={(val) => handleSelectChange(val, "oper_1")}
                                        value={formData.oper_1}
                                    />
                                    {errors.oper_1 && <p className="text-red-500 text-sm">{errors.oper_1}</p>}
                                </div>
                                <div>
                                    <Label>Coùt unitaire </Label>
                                    <Input
                                        type="text"
                                        id="cout_unit"
                                        name="cout_unit"
                                        error={!!errors.cout_unit}
                                        success={!!formData.cout_unit}
                                        onChange={handleChange}
                                        value={formData.cout_unit}
                                    />
                                    {errors.cout_unit && <p className="text-red-500 text-sm">{errors.cout_unit}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="machine">Machine</Label>
                                    <Input
                                        type="text"
                                        id="machine"
                                        name="machine"
                                        error={!!errors.machine}
                                        success={!!formData.machine}
                                        onChange={handleChange}
                                        value={formData.machine}
                                    />
                                    {errors.machine && <p className="text-red-500 text-sm">{errors.machine}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="mini">Mini</Label>
                                    <Input
                                        type="text"
                                        id="mini"
                                        name="mini"
                                        error={!!errors.mini}
                                        success={!!formData.mini}
                                        onChange={handleChange}
                                        value={formData.mini}
                                    />
                                    {errors.mini && <p className="text-red-500 text-sm">{errors.mini}</p>}
                                </div>
                                <div>
                                    <Label>ligne d'assamblage</Label>
                                    <Select
                                        options={Lignes.length > 0
                                            ? Lignes.map(dep => ({ value: String(dep.id_ligne), label: dep.nom_ligne }))
                                            : [{ value: "", label: "Aucun lignes disponible" }]
                                        }
                                        placeholder={loading ? "Chargement..." : "Sélectionner"}
                                        onChange={(val) => handleSelectChange(val, "id_ligne")}
                                        value={formData.id_ligne}
                                    />
                                    {errors.id_ligne && <p className="text-red-500 text-sm">{errors.id_ligne}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="table_elec">Table éléctrique </Label>
                                    <Input
                                        type="text"
                                        id="table_elec"
                                        name="table_elec"
                                        error={!!errors.table_elec}
                                        success={!!formData.table_elec}
                                        onChange={handleChange}
                                        value={formData.table_elec}
                                    />
                                    {errors.table_elec && <p className="text-red-500 text-sm">{errors.table_elec}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="qnt_lot">Quantité au lot </Label>
                                    <Select
                                        options={lots.length > 0
                                            ? lots.map(dep => ({ value: String(dep.id_lot), label: dep.num_lot }))
                                            : [{ value: "", label: "Aucun lot disponible" }]
                                        }
                                        placeholder={loading ? "Chargement..." : "Sélectionner"}
                                        onChange={(val) => handleSelectChange(val, "id_lot")}
                                        value={formData.id_lot}
                                    />
                                    {errors.id_lot && <p className="text-red-500 text-sm">{errors.id_lot}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="qnt_scrap">Quantité de scrap</Label>
                                    <Input
                                        type="number"
                                        id="qnt_scrap"
                                        name="qnt_scrap"
                                        error={!!errors.qnt_scrap}
                                        success={!!formData.qnt_scrap}
                                        onChange={handleChange}
                                        value={formData.qnt_scrap}
                                    />
                                    {errors.qnt_scrap && <p className="text-red-500 text-sm">{errors.qnt_scrap}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="cause_prob">Cause probléme</Label>
                                    <Input
                                        type="text"
                                        id="cause_prob"
                                        name="cause_prob"
                                        error={!!errors.cause_prob}
                                        success={!!formData.cause_prob}
                                        onChange={handleChange}
                                        value={formData.cause_prob}
                                    />
                                    {errors.cause_prob && <p className="text-red-500 text-sm">{errors.cause_prob}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="classification_cause">Classification de la root cause</Label>
                                    <Input
                                        type="text"
                                        id="classification_cause"
                                        name="classification_cause"
                                        error={!!errors.classification_cause}
                                        success={!!formData.classification_cause}
                                        onChange={handleChange}
                                        value={formData.classification_cause}
                                    />
                                    {errors.classification_cause && <p className="text-red-500 text-sm">{errors.classification_cause}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="ac_immed_prend">Action immédiate a prendre</Label>
                                    <Input
                                        type="text"
                                        id="ac_immed_prend"
                                        name="ac_immed_prend"
                                        error={!!errors.ac_immed_prend}
                                        success={!!formData.ac_immed_prend}
                                        onChange={handleChange}
                                        value={formData.ac_immed_prend}
                                    />
                                    {errors.ac_immed_prend && <p className="text-red-500 text-sm">{errors.ac_immed_prend}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="rebut_remplacer">remplcement rebut</Label>
                                    <Input
                                        type="text"
                                        id="rebut_remplacer"
                                        name="rebut_remplacer"
                                        error={!!errors.rebut_remplacer}
                                        success={!!formData.rebut_remplacer}
                                        onChange={handleChange}
                                        value={formData.rebut_remplacer}
                                    />
                                    {errors.rebut_remplacer && <p className="text-red-500 text-sm">{errors.rebut_remplacer}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="odl_rep">ODL à relancer par la logistique</Label>
                                    <Input
                                        type="text"
                                        id="odl_rep"
                                        name="odl_rep"
                                        error={!!errors.odl_rep}
                                        success={!!formData.odl_rep}
                                        onChange={handleChange}
                                        value={formData.odl_rep}
                                    />
                                    {errors.odl_rep && <p className="text-red-500 text-sm">{errors.odl_rep}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="new_odl">Nouvelle ODL</Label>
                                    <Input
                                        type="text"
                                        id="new_odl"
                                        name="new_odl"
                                        error={!!errors.new_odl}
                                        success={!!formData.new_odl}
                                        onChange={handleChange}
                                        value={formData.new_odl}
                                    />
                                    {errors.new_odl && <p className="text-red-500 text-sm">{errors.new_odl}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="Desc_acmo">Description de l'action mise en œuvre</Label>
                                    <Input
                                        type="text"
                                        id="Desc_acmo"
                                        name="Desc_acmo"
                                        error={!!errors.Desc_acmo}
                                        success={!!formData.Desc_acmo}
                                        onChange={handleChange}
                                        value={formData.Desc_acmo}
                                    />
                                    {errors.Desc_acmo && <p className="text-red-500 text-sm">{errors.Desc_acmo}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="N_pecRec">Nombre des pièces récupérées </Label>
                                    <Input
                                        type="number"
                                        id="N_pecRec"
                                        name="N_pecRec"
                                        error={!!errors.N_pecRec}
                                        success={!!formData.N_pecRec}
                                        onChange={handleChange}
                                        value={formData.N_pecRec}
                                    />
                                    {errors.N_pecRec && <p className="text-red-500 text-sm">{errors.N_pecRec}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="qnt_rebF">Quantité rebuté final</Label>
                                    <Input
                                        type="text"
                                        id="qnt_rebF"
                                        name="qnt_rebF"
                                        error={!!errors.qnt_rebF}
                                        success={!!formData.qnt_rebF}
                                        onChange={handleChange}
                                        value={formData.qnt_rebF}
                                    />
                                    {errors.qnt_rebF && <p className="text-red-500 text-sm">{errors.qnt_rebF}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="h_interne">Heur interne dépenser pour rework</Label>
                                    <Input
                                        type="text"
                                        id="h_interne"
                                        name="h_interne"
                                        error={!!errors.h_interne}
                                        success={!!formData.h_interne}
                                        onChange={handleChange}
                                        value={formData.h_interne}
                                    />
                                    {errors.h_interne && <p className="text-red-500 text-sm">{errors.h_interne}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="h_externe">heur externe dépensé</Label>
                                    <Input
                                        type="text"
                                        id="h_externe"
                                        name="h_externe"
                                        error={!!errors.h_externe}
                                        success={!!formData.h_externe}
                                        onChange={handleChange}
                                        value={formData.h_externe}
                                    />
                                    {errors.h_externe && <p className="text-red-500 text-sm">{errors.h_externe}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="cout_final">Coùt final</Label>
                                    <Input
                                        type="number"
                                        id="cout_final"
                                        name="cout_final"
                                        error={!!errors.cout_final}
                                        success={!!formData.cout_final}
                                        onChange={handleChange}
                                        value={formData.cout_final}
                                    />
                                    {errors.cout_final && <p className="text-red-500 text-sm">{errors.cout_final}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="res_pos">Résulat positif de tri</Label>
                                    <Input
                                        type="text"
                                        id="res_pos"
                                        name="res_pos"
                                        error={!!errors.res_pos}
                                        success={!!formData.res_pos}
                                        onChange={handleChange}
                                        value={formData.res_pos}
                                    />
                                    {errors.res_pos && <p className="text-red-500 text-sm">{errors.res_pos}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="ac_corr_suppl">Actions correctives supplémentaires</Label>
                                    <Input
                                        type="text"
                                        id="ac_corr_suppl"
                                        name="ac_corr_suppl"
                                        error={!!errors.ac_corr_suppl}
                                        success={!!formData.ac_corr_suppl}
                                        onChange={handleChange}
                                        value={formData.ac_corr_suppl}
                                    />
                                    {errors.ac_corr_suppl && <p className="text-red-500 text-sm">{errors.ac_corr_suppl}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="N_ac_corr_ex">N° actions correctives externes</Label>
                                    <Input
                                        type="text"
                                        id="N_ac_corr_ex"
                                        name="N_ac_corr_ex"
                                        error={!!errors.N_ac_corr_ex}
                                        success={!!formData.N_ac_corr_ex}
                                        onChange={handleChange}
                                        value={formData.N_ac_corr_ex}
                                    />
                                    {errors.N_ac_corr_ex && <p className="text-red-500 text-sm">{errors.N_ac_corr_ex}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="poids_rebut">Poids de rebut</Label>
                                    <Input
                                        type="text"
                                        id="poids_rebut"
                                        name="poids_rebut"
                                        error={!!errors.poids_rebut}
                                        success={!!formData.poids_rebut}
                                        onChange={handleChange}
                                        value={formData.poids_rebut}
                                    />
                                    {errors.poids_rebut && <p className="text-red-500 text-sm">{errors.poids_rebut}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="valeur_scrap">Valeur scrap</Label>
                                    <Input
                                        type="text"
                                        id="valeur_scrap"
                                        name="valeur_scrap"
                                        error={!!errors.valeur_scrap}
                                        success={!!formData.valeur_scrap}
                                        onChange={handleChange}
                                        value={formData.valeur_scrap}
                                    />
                                    {errors.valeur_scrap && <p className="text-red-500 text-sm">{errors.valeur_scrap}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="note">Note</Label>
                                    <Input
                                        type="text"
                                        id="note"
                                        name="note"
                                        error={!!errors.note}
                                        success={!!formData.note}
                                        onChange={handleChange}
                                        value={formData.note}
                                    />
                                    {errors.note && <p className="text-red-500 text-sm">{errors.note}</p>}
                                </div>
                                <div>
                                    <Label>Level</Label>
                                    <Select
                                        options={optionsLevel}
                                        placeholder="Sélectionner un niveau"
                                        onChange={(val) => handleSelectChange(val, "level")}
                                        value={formData.level}
                                    />
                                    {errors.level && <p className="text-red-500 text-sm">{errors.level}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-0 lg:justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-3 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
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
            </Modal >
        </div >
    );
}