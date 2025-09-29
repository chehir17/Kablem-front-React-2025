import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import DatePicker from "../form/date-picker";

interface EditRegisterSCRAPModelProps {
    isOpen: boolean;
    onClose: () => void;
    registerscraps: {
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
        level: string;
    } | null;
    onSave: (updatedRegistscrap: {
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
        level: string;
    }) => void;
}

export default function EditRegisterSCRAPModel({
    isOpen,
    onClose,
    registerscraps,
    onSave,
}: EditRegisterSCRAPModelProps) {

    const [formData, setFormData] = useState({
        id: 0,
        created_at: "",
        compilateur: "",
        zone_affe_prob: "",
        annulation: "",
        desc_prob: "",
        code_artc: "",
        date_prod: new Date(""),
        first_name: "",
        cout_unit: "",
        machine: "",
        mini: "",
        nom_ligne: "",
        table_elec: "",
        qnt_produit: "",
        qnt_scrap: "",
        cause_prob: "",
        classification_cause: "",
        ac_immed_prend: "",
        rebut_remplacer: "",
        odl_rep: "",
        new_odl: "",
        Desc_acmo: "",
        N_pecRec: "",
        qnt_rebF: "",
        h_interne: "",
        h_externe: "",
        cout_final: "",
        res_pos: "",
        ac_corr_suppl: "",
        N_ac_corr_ex: "",
        note: "",
        poids_rebut: "",
        valeur_scrap: "",
        level: "",

    });

    useEffect(() => {
        if (registerscraps) {
            setFormData(registerscraps);
        }
    }, [registerscraps]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, code_artc: value });
    };

    const optionsLigne = [
        { value: "Ligne1", label: "Ligne 01" },
        { value: "ligne2", label: "Ligne 02" },
    ];

    const handleSubmit = () => {
        onSave(formData);
        console.log("Ligne mis à jour :", formData);
        onClose();
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

    const optionsCompilateurs = [
        { value: "mostfa", label: "Mostafa" },
        { value: "hamadi", label: "Hamadi" },
    ];

    const optionsCodeArticle = [
        { value: "ART-001", label: "Article 1" },
        { value: "ART-002", label: "Article 2" },
        { value: "ART-003", label: "Article 3" },
        { value: "ART-004", label: "Article 4" },
    ];

    const optionsLevel = [
        { value: "High_level", label: "High Level" },
        { value: "medium_level", label: "Medium Level" },
    ];

    return (
        <div>
            <Modal isOpen={isOpen} onClose={onClose} className="max-w-[1250px] m-2 mt-70">
                <div className="no-scrollbar relative w-full max-w-[1250px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Modifier Registre SCRAP N°{formData.id}
                    </h4>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-auto overflow-y-auto px-2 mb-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                <div>
                                    <Label>compilateur</Label>
                                    <Select
                                        options={optionsCompilateurs}
                                        placeholder="Sélectionner un code"
                                        onChange={handleSelectChange}
                                        value={formData.compilateur}
                                    />
                                </div>
                                <div>
                                    <Label>Zone de probléme</Label>
                                    <Select
                                        options={optionsZoneProb}
                                        placeholder="Sélectionner un code"
                                        onChange={handleSelectChange}
                                        value={formData.zone_affe_prob}
                                    />
                                </div>
                                <div>
                                    <Label>Annulation</Label>
                                    <Select
                                        options={optionsAnnulation}
                                        placeholder="Sélectionner un code"
                                        onChange={handleSelectChange}
                                        value={formData.annulation}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="desc_prob">description de probléme</Label>
                                    <Input
                                        type="text"
                                        id="desc_prob"
                                        name="desc_prob"
                                        value={formData.desc_prob}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="">
                                    <DatePicker
                                        id="date_prod"
                                        label="Date produit"
                                        placeholder="Select a date"
                                        onChange={(dates,) => {
                                            const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                                            setFormData({
                                                ...formData,
                                                date_prod: selectedDate || new Date(),
                                            });
                                        }}
                                    />
                                </div>
                                <div>
                                    <Label>Code Produit</Label>
                                    <Select
                                        options={optionsCodeArticle}
                                        placeholder="Sélectionner un code"
                                        onChange={handleSelectChange}
                                        value={formData.code_artc}
                                    />
                                </div>
                                <div>
                                    <Label>Opérateure 1</Label>
                                    <Select
                                        options={optionsCompilateurs}
                                        placeholder="Sélectionner un Opérateure"
                                        onChange={handleSelectChange}
                                        value={formData.first_name}
                                    />
                                </div>
                                <div>
                                    <Label>Coùt unitaire </Label>
                                    <Input
                                        type="text"
                                        id="cout_unit"
                                        name="cout_unit"
                                        value={formData.cout_unit}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="machine">Machine</Label>
                                    <Input
                                        type="text"
                                        id="machine"
                                        name="machine"
                                        value={formData.machine}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="mini">Mini</Label>
                                    <Input
                                        type="text"
                                        id="mini"
                                        name="mini"
                                        value={formData.mini}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label>ligne d'assamblage</Label>
                                    <Select
                                        options={optionsLigne}
                                        placeholder="Sélectionner un Ligne"
                                        onChange={handleSelectChange}
                                        value={formData.nom_ligne}

                                    />
                                </div>
                                <div>
                                    <Label htmlFor="table_elec">Table éléctrique </Label>
                                    <Input
                                        type="text"
                                        id="table_elec"
                                        name="table_elec"
                                        value={formData.table_elec}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="qnt_produit">Quantité au lot </Label>
                                    <Input
                                        type="number"
                                        id="qnt_produit"
                                        name="qnt_produit"
                                        value={formData.qnt_produit}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="qnt_scrap">Quantité de scrap</Label>
                                    <Input
                                        type="number"
                                        id="qnt_scrap"
                                        name="qnt_scrap"
                                        value={formData.qnt_scrap}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="cause_prob">Cause probléme</Label>
                                    <Input
                                        type="text"
                                        id="cause_prob"
                                        name="cause_prob"
                                        value={formData.cause_prob}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="classification_cause">Classification de la root cause</Label>
                                    <Input
                                        type="text"
                                        id="classification_cause"
                                        name="classification_cause"
                                        value={formData.classification_cause}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="ac_immed_prend">Action immédiate a prendre</Label>
                                    <Input
                                        type="text"
                                        id="ac_immed_prend"
                                        name="ac_immed_prend"
                                        value={formData.ac_immed_prend}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="rebut_remplacer">remplcement rebut</Label>
                                    <Input
                                        type="text"
                                        id="rebut_remplacer"
                                        name="rebut_remplacer"
                                        value={formData.rebut_remplacer}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="odl_rep">ODL à relancer par la logistique</Label>
                                    <Input
                                        type="text"
                                        id="odl_rep"
                                        name="odl_rep"
                                        value={formData.odl_rep}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="new_odl">Nouvelle ODL</Label>
                                    <Input
                                        type="text"
                                        id="new_odl"
                                        name="new_odl"
                                        value={formData.new_odl}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="Desc_acmo">Description de l'action mise en œuvre</Label>
                                    <Input
                                        type="text"
                                        id="Desc_acmo"
                                        name="Desc_acmo"
                                        value={formData.Desc_acmo}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="N_pecRec">Nombre des pièces récupérées </Label>
                                    <Input
                                        type="text"
                                        id="N_pecRec"
                                        name="N_pecRec"
                                        value={formData.N_pecRec}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="qnt_rebF">Quantité rebuté final</Label>
                                    <Input
                                        type="text"
                                        id="qnt_rebF"
                                        name="qnt_rebF"
                                        value={formData.qnt_rebF}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="h_interne">Heur interne dépenser pour rework</Label>
                                    <Input
                                        type="text"
                                        id="h_interne"
                                        name="h_interne"
                                        value={formData.h_interne}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="h_externe">heur externe dépensé</Label>
                                    <Input
                                        type="text"
                                        id="h_externe"
                                        name="h_externe"
                                        value={formData.h_externe}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="cout_final">Coùt final</Label>
                                    <Input
                                        type="number"
                                        id="cout_final"
                                        name="cout_final"
                                        value={formData.cout_final}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="res_pos">Résulat positif de tri</Label>
                                    <Input
                                        type="text"
                                        id="res_pos"
                                        name="res_pos"
                                        value={formData.res_pos}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="ac_corr_suppl">Actions correctives supplémentaires</Label>
                                    <Input
                                        type="text"
                                        id="ac_corr_suppl"
                                        name="ac_corr_suppl"
                                        value={formData.ac_corr_suppl}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="N_ac_corr_ex">N° actions correctives externes</Label>
                                    <Input
                                        type="text"
                                        id="N_ac_corr_ex"
                                        name="N_ac_corr_ex"
                                        value={formData.N_ac_corr_ex}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="poids_rebut">Poids de rebut</Label>
                                    <Input
                                        type="text"
                                        id="poids_rebut"
                                        name="poids_rebut"
                                        value={formData.poids_rebut}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="valeur_scrap">Valeur scrap</Label>
                                    <Input
                                        type="text"
                                        id="valeur_scrap"
                                        name="valeur_scrap"
                                        value={formData.valeur_scrap}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="note">Note</Label>
                                    <Input
                                        type="text"
                                        id="note"
                                        name="note"
                                        value={formData.note}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label>Level</Label>
                                    <Select
                                        options={optionsLevel}
                                        placeholder="Sélectionner un Ligne"
                                        onChange={handleSelectChange}
                                        value={formData.level}
                                    />
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
                                    className="px-3 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-700"
                                >
                                    Sauvegarder
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}