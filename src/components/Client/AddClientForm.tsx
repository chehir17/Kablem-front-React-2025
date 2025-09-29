import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import ComponentCard from "../common/ComponentCard.tsx";
import Select from "../form/Select.tsx";

export default function AddClientForm() {
    const options = [
        { value: "actif", label: "Actif" },
        { value: "inactif", label: "Inactif" },
    ];
    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };

    return (
        <ComponentCard title="Ajouter un Client">
            <div className="space-y-6">
                <div>
                    <Label htmlFor="input">Nom de Client</Label>
                    <Input type="text" id="input" />
                </div>
                <div>
                    <Label htmlFor="inputTwo">Reference de Client</Label>
                    <Input type="text" id="inputTwo" placeholder="" />
                </div>
                <div>
                    <Label htmlFor="inputThree">Organisme/Société</Label>
                    <Input type="text" id="inputThree" placeholder="" />
                </div>
                <div>
                    <Label htmlFor="inputTwo">Input with Placeholder</Label>
                    <Input type="email" id="inputTwo" placeholder="info@gmail.com" />
                </div>
                <div>
                    <Label>Status</Label>
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
                    onClick={() => alert(`Ajouter un Client`)}
                    className="px-3 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-700"
                    type="submit"
                >
                    Ajouter Client
                </button>
            </div>
        </ComponentCard>
    );
}
