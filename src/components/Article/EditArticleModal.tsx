import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import { ArticleService } from "../../services/ArticleService";

interface Option {
    value: string;
    label: string;
}

interface Article {
    id_article: number;
    code_artc: string;
    nom_artc: string;
    type: string;
}

interface EditArticleModalProps {
    isOpen: boolean;
    onClose: () => void;
    article: Article | null;
    onSave: (updatedArticle: Article) => void;
}

export default function EditArticleModal({
    isOpen,
    onClose,
    article,
    onSave,
}: EditArticleModalProps) {
    const [formData, setFormData] = useState<Article>({
        id_article: 0,
        code_artc: "",
        nom_artc: "",
        type: "",
    });

    const [loading, setLoading] = useState(false);

    const typeOptions: Option[] = [
        { value: "Matiere Premiere", label: "Matiere Premiere" },
        { value: "Produit Final", label: "Produit Final" },
    ];

    useEffect(() => {
        if (article) setFormData(article);
    }, [article]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, type: value });
    };

    const handleSubmit = async () => {
        if (!formData.code_artc || !formData.nom_artc || !formData.type) {
            alert("Veuillez remplir tous les champs !");
            return;
        }

        try {
            setLoading(true);
            const updated = await ArticleService.updateArticle(formData.id_article, formData);
            console.log("✅ Article mis à jour :", updated);
            onSave(updated);
            swal({
                title: "succès !",
                text: " Article mis à jour !",
                icon: "success",
            })
            onClose();
            window.location.reload();
        } catch (error) {
            swal({
                title: "Erreur !",
                text: "❌ Erreur lors de la mise à jour de l'article !",
                icon: "error",
            })
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-2">
            <div className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Modifier l'article
                </h4>

                <form className="flex flex-col space-y-4">
                    <div>
                        <Label htmlFor="code_artc">Code Article</Label>
                        <Input
                            type="text"
                            id="code_artc"
                            name="code_artc"
                            value={formData.code_artc}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="nom_artc">Nom d'article</Label>
                        <Input
                            type="text"
                            id="nom_artc"
                            name="nom_artc"
                            value={formData.nom_artc}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label>Type</Label>
                        <Select
                            options={typeOptions}
                            placeholder="Sélectionner un type"
                            onChange={handleSelectChange}
                            value={formData.type}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
                            disabled={loading}
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className={`px-4 py-2 text-sm text-white rounded ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            disabled={loading}
                        >
                            {loading ? "Sauvegarde..." : "Sauvegarder"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
