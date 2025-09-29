import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../common/ComponentCard.tsx";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import Select from "../form/Select.tsx";
import DatePicker from "../form/date-picker.tsx";
import GoBackButton from "../../utils/GoBack.tsx";



export default function AddLigneForm() {

    const options = [
        { value: "actif", label: "Actif" },
        { value: "inactif", label: "Inactif" },
    ];

    const departementOptions = [
        { value: "qualité", label: "Qualité" },
        { value: "dep_extrusion", label: "Département extrusion" },
        { value: "dep_cablage", label: "Département câblage" },
        { value: "dep_assemblage", label: "Département assemblage" },
    ];

    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };

    return (
        <>
            <div>
                <PageMeta
                    title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
                    description="This is React.js Blank Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
                />
                <div className="flex items-center justify-between mb-1">
                    <GoBackButton />
                    <PageBreadcrumb pageTitle="" />
                </div>
                <ComponentCard title="Ajouter une Ligne">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="input">Nom du Ligne</Label>
                            <Input type="text" id="input" />
                        </div>
                        <div>
                            <Label htmlFor="inputTwo">Reference de Ligne</Label>
                            <Input type="text" id="inputTwo" placeholder="" />
                        </div>

                        <div>
                            <Label>Departement</Label>
                            <Select
                                options={departementOptions}
                                placeholder="Select an option"
                                onChange={handleSelectChange}
                                className="dark:bg-dark-900"
                            />
                        </div>
                        <div>
                            <Label htmlFor="capacite">Capacité de production</Label>
                            <Input type="number" id="capacite" placeholder="000.00" />
                        </div>

                        <div>
                            <Label htmlFor="responsable">Responsable de Ligne</Label>
                            <Input type="text" id="responsable" />
                        </div>
                        <div>
                            <DatePicker
                                id="date-maintenance"
                                label="Dernière Maintenance"
                                placeholder="Select a date"
                                onChange={(dates, currentDateString) => {
                                    console.log({ dates, currentDateString });
                                }}
                            />
                        </div>

                        <div>
                            <DatePicker
                                id="prochaine-maintenance"
                                label="Prochaine date Maintenance"
                                placeholder="Select a date"
                                onChange={(dates, currentDateString) => {
                                    console.log({ dates, currentDateString });
                                }}
                            />
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

                    <div className="flex items-center justify-center mt-6">
                        <button
                            onClick={() => alert(`Ajouter une Ligne`)}
                            className="px-3 py-2 text-sm text-white bg-blue-500 rounded shadow-md hover:bg-blue-700"
                            type="submit"
                        >
                            Ajouter Ligne
                        </button>
                    </div>
                </ComponentCard>
            </div>
        </>
    );
}
