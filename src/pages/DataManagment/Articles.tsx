import { JSX, useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
import DataTableLayout from "../../layout/DataTableLayout";
import AddArticleForm from "../../components/Article/AddArticleForm";
import EditArticleModal from "../../components/Article/EditArticleModal";
import { Trash, Update } from "../../icons";
import { ArticleService } from "../../services/ArticleService";
import { Article } from "../../types/Articles";

const tableData: Article[] = [];

interface Column<T> {
    name: string;
    selector?: (row: T) => string | number;
    sortable?: boolean;
    cell?: (row: T) => JSX.Element;
}

export default function ArticlePage() {

    const [articles, setArticles] = useState<Article[]>(tableData);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await ArticleService.getArticles();
                if (Array.isArray(data)) {
                    setArticles(data);
                } else {
                    console.error("⚠️ La réponse n'est pas un tableau :", data);
                    setArticles([]);
                }
            } catch (err) {
                setError("❌ Impossible de charger les articles.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const handleEdit = (row: Article) => {
        setSelectedArticle(row);
        setIsModalOpen(true);
    };

    const handleSave = (updatedArticle: Article) => {
        setArticles((prev) =>
            prev.map((a) =>
                a.id_article === updatedArticle.id_article ? updatedArticle : a
            )
        );
        setIsModalOpen(false);
    };

    const handleDelete = async (id_article: number) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet article ?")) return;
        try {
            await ArticleService.deleteArticle(id_article);
            setArticles((prev) => prev.filter((a) => a.id_article !== id_article));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
        }
    };

    const columns: Column<Article>[] = [
        {
            name: "Code de l'article",
            selector: (row) => row.code_artc,
            sortable: true,
        },
        {
            name: "Nom de l'article",
            selector: (row) => row.nom_artc,
            sortable: true,
        },
        {
            name: "Type",
            sortable: true,
            cell: (row) => (
                <Badge
                    color={
                        row.type === "produit final"
                            ? "success"
                            : row.type === "Matiere premiere"
                                ? "warning"
                                : "error"
                    }
                    variant="light"
                >
                    {row.type}
                </Badge>
            ),
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                        <Update className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id_article)}
                        className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                    >
                        <Trash className="w-5 h-5" />
                    </button>
                </div>
            ),
        },
    ];

    if (loading) return <p className="p-4 text-center dark:text-white/70">⏳ Chargement des articles...</p>;
    if (error) return <p className="p-4 text-center text-red-600">{error}</p>;

    return (
        <div>
            <PageMeta title="Articles" description="Page de gestion des articles" />
            <PageBreadcrumb pageTitle="Articles" />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                    <DataTableLayout
                        title="Liste des Articles"
                        columns={columns}
                        data={articles}
                        loading={loading}
                        error={error}
                    />
                    {selectedArticle && (
                        <EditArticleModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            article={selectedArticle}
                            onSave={handleSave}
                        />
                    )}
                </div>

                <div className="space-y-6 xl:col-span-1">
                    <AddArticleForm />
                </div>
            </div>
        </div>
    );
}
