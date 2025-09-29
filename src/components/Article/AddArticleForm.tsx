import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import ComponentCard from "../common/ComponentCard.tsx";
import Select from "../form/Select.tsx";

export default function AddArticleForm() {
    const options = [
        { value: "Matiere premiere", label: "Matiere Premiere" },
        { value: "produit final", label: "Produit Final" },
    ];
    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };

    return (
        <ComponentCard title="Ajouter un article">
            <div className="space-y-6">
                <div>
                    <Label htmlFor="input">Code Article</Label>
                    <Input type="text" id="input" />
                </div>
                <div>
                    <Label htmlFor="inputTwo">Nom d'article</Label>
                    <Input type="text" id="inputTwo" placeholder="" />
                </div>
                <div>
                    <Label>Select Input</Label>
                    <Select
                        options={options}
                        placeholder="Select an option"
                        onChange={handleSelectChange}
                        className="dark:bg-dark-900"
                    />
                </div>
            </div>
            <div className="flex items-center justify-center h-full">
                <button
                    onClick={() => alert(`Ajouter un Article`)}
                    className="px-3 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-700"
                    type="submit"
                >
                    Ajouter Article
                </button>
            </div>
        </ComponentCard>
    );
}
