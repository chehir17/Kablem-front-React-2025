import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import PageMeta from "../common/PageMeta";
import GoBackButton from "../../utils/GoBack";
import PageBreadcrumb from "../common/PageBreadCrumb";
import ComponentCard from "../common/ComponentCard";


export default function AddRegisterSCRAPForm() {

    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };

    const optionsLigne = [
        { value: "Ligne1", label: "Ligne 01" },
        { value: "ligne2", label: "Ligne 02" },
    ];

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
            <PageMeta
                title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <div className="flex items-center justify-between mb-1">
                <GoBackButton />
                <PageBreadcrumb pageTitle="" />
            </div>
            <ComponentCard title="Ajouter un Registre SCRAP">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label>compilateur</Label>
                        <Select
                            options={optionsCompilateurs}
                            placeholder="Sélectionner un code"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label>Zone de probléme</Label>
                        <Select
                            options={optionsZoneProb}
                            placeholder="Sélectionner un code"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label>Annulation</Label>
                        <Select
                            options={optionsAnnulation}
                            placeholder="Sélectionner un code"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="desc_prob">description de probléme</Label>
                        <Input
                            type="text"
                            id="desc_prob"
                            name="desc_prob"
                        />
                    </div>
                    <div className="">
                        <DatePicker
                            id="date_prod"
                            label="Date produit"
                            placeholder="Select a date"
                            onChange={(dates,) => {
                                const selectedDate = Array.isArray(dates) ? dates[0] : dates;
                            }}
                        />
                    </div>
                    <div>
                        <Label>Code Produit</Label>
                        <Select
                            options={optionsCodeArticle}
                            placeholder="Sélectionner un code"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label>Opérateure 1</Label>
                        <Select
                            options={optionsCompilateurs}
                            placeholder="Sélectionner un Opérateure"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label>Coùt unitaire </Label>
                        <Input
                            type="text"
                            id="cout_unit"
                            name="cout_unit"
                        />
                    </div>
                    <div>
                        <Label htmlFor="machine">Machine</Label>
                        <Input
                            type="text"
                            id="machine"
                            name="machine"
                        />
                    </div>
                    <div>
                        <Label htmlFor="mini">Mini</Label>
                        <Input
                            type="text"
                            id="mini"
                            name="mini"
                        />
                    </div>
                    <div>
                        <Label>ligne d'assamblage</Label>
                        <Select
                            options={optionsLigne}
                            placeholder="Sélectionner un Ligne"
                            onChange={handleSelectChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="table_elec">Table éléctrique </Label>
                        <Input
                            type="text"
                            id="table_elec"
                            name="table_elec"
                        />
                    </div>
                    <div>
                        <Label htmlFor="qnt_produit">Quantité au lot </Label>
                        <Input
                            type="number"
                            id="qnt_produit"
                            name="qnt_produit"
                        />
                    </div>
                    <div>
                        <Label htmlFor="qnt_scrap">Quantité de scrap</Label>
                        <Input
                            type="number"
                            id="qnt_scrap"
                            name="qnt_scrap"
                        />
                    </div>
                    <div>
                        <Label htmlFor="cause_prob">Cause probléme</Label>
                        <Input
                            type="text"
                            id="cause_prob"
                            name="cause_prob"
                        />
                    </div>
                    <div>
                        <Label htmlFor="classification_cause">Classification de la root cause</Label>
                        <Input
                            type="text"
                            id="classification_cause"
                            name="classification_cause"
                        />
                    </div>
                    <div>
                        <Label htmlFor="ac_immed_prend">Action immédiate a prendre</Label>
                        <Input
                            type="text"
                            id="ac_immed_prend"
                            name="ac_immed_prend"
                        />
                    </div>
                    <div>
                        <Label htmlFor="rebut_remplacer">remplcement rebut</Label>
                        <Input
                            type="text"
                            id="rebut_remplacer"
                            name="rebut_remplacer"
                        />
                    </div>
                    <div>
                        <Label htmlFor="odl_rep">ODL à relancer par la logistique</Label>
                        <Input
                            type="text"
                            id="odl_rep"
                            name="odl_rep"
                        />
                    </div>
                    <div>
                        <Label htmlFor="new_odl">Nouvelle ODL</Label>
                        <Input
                            type="text"
                            id="new_odl"
                            name="new_odl"
                        />
                    </div>
                    <div>
                        <Label htmlFor="Desc_acmo">Description de l'action mise en œuvre</Label>
                        <Input
                            type="text"
                            id="Desc_acmo"
                            name="Desc_acmo"
                        />
                    </div>
                    <div>
                        <Label htmlFor="N_pecRec">Nombre des pièces récupérées </Label>
                        <Input
                            type="text"
                            id="N_pecRec"
                            name="N_pecRec"
                        />
                    </div>
                    <div>
                        <Label htmlFor="qnt_rebF">Quantité rebuté final</Label>
                        <Input
                            type="text"
                            id="qnt_rebF"
                            name="qnt_rebF"
                        />
                    </div>
                    <div>
                        <Label htmlFor="h_interne">Heur interne dépenser pour rework</Label>
                        <Input
                            type="text"
                            id="h_interne"
                            name="h_interne"
                        />
                    </div>
                    <div>
                        <Label htmlFor="h_externe">heur externe dépensé</Label>
                        <Input
                            type="text"
                            id="h_externe"
                            name="h_externe"
                        />
                    </div>
                    <div>
                        <Label htmlFor="cout_final">Coùt final</Label>
                        <Input
                            type="number"
                            id="cout_final"
                            name="cout_final"
                        />
                    </div>
                    <div>
                        <Label htmlFor="res_pos">Résulat positif de tri</Label>
                        <Input
                            type="text"
                            id="res_pos"
                            name="res_pos"
                        />
                    </div>
                    <div>
                        <Label htmlFor="ac_corr_suppl">Actions correctives supplémentaires</Label>
                        <Input
                            type="text"
                            id="ac_corr_suppl"
                            name="ac_corr_suppl"
                        />
                    </div>
                    <div>
                        <Label htmlFor="N_ac_corr_ex">N° actions correctives externes</Label>
                        <Input
                            type="text"
                            id="N_ac_corr_ex"
                            name="N_ac_corr_ex"
                        />
                    </div>
                    <div>
                        <Label htmlFor="poids_rebut">Poids de rebut</Label>
                        <Input
                            type="text"
                            id="poids_rebut"
                            name="poids_rebut"
                        />
                    </div>
                    <div>
                        <Label htmlFor="valeur_scrap">Valeur scrap</Label>
                        <Input
                            type="text"
                            id="valeur_scrap"
                            name="valeur_scrap"
                        />
                    </div>
                    <div>
                        <Label htmlFor="note">Note</Label>
                        <Input
                            type="text"
                            id="note"
                            name="note"
                        />
                    </div>
                    <div>
                        <Label>Level</Label>
                        <Select
                            options={optionsLevel}
                            placeholder="Sélectionner un Ligne"
                            onChange={handleSelectChange}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-center mt-6">
                    <button
                        onClick={() => alert(`Ajouter un utilisateur`)}
                        className="px-3 py-2 text-sm text-white bg-blue-500 rounded shadow-md hover:bg-blue-700"
                        type="submit"
                    >
                        Ajouter Fiche DMPP
                    </button>
                </div>
            </ComponentCard>
        </div>
    );
}