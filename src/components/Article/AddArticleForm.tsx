import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import ComponentCard from "../common/ComponentCard.tsx";
import Select from "../form/Select.tsx";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ArticleService } from "../../services/ArticleService.tsx";

export default function AddArticleForm() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState<any>({});
    const [formData, setFormData] = useState<any>({
        id_article: "",
        code_artc: "",
        nom_artc: "",
        type: "",
    });

    const options = [
        { value: "Matiere premiere", label: "Matiere Premiere" },
        { value: "produit final", label: "Produit Final" },
    ];

    const handleSelectChange = (
        option: { value: string; label: string } | string,
        field: string
    ) => {
        const value = typeof option === "string" ? option : option?.value;
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: "" });
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setErrors({ ...errors, [e.target.id]: "" });
    };

    const validateForm = () => {
        let newErrors: any = {};

        if (!formData.code_artc) newErrors.code_artc = "Le code article est requis";
        if (!formData.nom_artc) newErrors.nom_artc = "Le nom de l'article est requis";
        if (!formData.type) newErrors.type = "Le type est requis";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddPlanAction = async () => {
        if (!validateForm()) return;
        try {
            

            console.log("📤 Données envoyées :", formData);

            const res = await ArticleService.createArticle(formData);

            swal({
                title: "Succès !",
                text: "L'article a été ajouté avec succès.",
                icon: "success",
            }).then(() => {
                window.location.reload();
            });
        } catch (err) {
            console.error("❌ Erreur d’ajout :", err);
            swal("Erreur", "Une erreur est survenue lors de l’ajout.", "error");
        }
    };

    

    return (
        <ComponentCard title="Ajouter un article">
            <div className="space-y-6">
                <div>
                    <Label htmlFor="code_artc">Code Article</Label>
                    <Input
                        type="text"
                        id="code_artc"
                        onChange={handleChange}
                        error={!!errors.code_artc} success={!!formData.code_artc}
                    />
                    {errors.code_artc && <p className="text-red-500 text-sm">{errors.code_artc}</p>}
                </div>
                <div>
                    <Label htmlFor="nom_artc">Nom d'article</Label>
                    <Input
                        type="text"
                        id="nom_artc"
                        onChange={handleChange}
                        error={!!errors.nom_artc}
                        success={!!formData.nom_artc}
                    />
                    {errors.nom_artc && <p className="text-red-500 text-sm">{errors.nom_artc}</p>}
                </div>
                <div>
                    <Label>Select Type</Label>
                    <Select
                        options={options}
                        placeholder="Select an option"
                        onChange={(val) => handleSelectChange(val, "type")}
                        className="dark:bg-dark-900"
                    />
                    {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
                </div>
            </div>
            <div className="flex items-center justify-center h-full">
                <button
                    onClick={handleAddPlanAction}
                    className="px-3 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-700"
                    type="submit"
                >
                    Ajouter Article
                </button>
            </div>
        </ComponentCard>
    );
}
