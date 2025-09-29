import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../common/ComponentCard.tsx";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import Select from "../form/Select.tsx";
import DatePicker from "../form/date-picker.tsx";
import GoBackButton from "../../utils/GoBack.tsx";



export default function AddPieceLivreForm() {

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
                <ComponentCard title="Ajouter une Pièce Livrée">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="input">Piéce livré client</Label>
                            <Input type="text" id="input" />
                        </div>
                        <div>
                            <Label htmlFor="inputTwo">Piéce livré P1_P2</Label>
                            <Input type="text" id="inputTwo" placeholder="" />
                        </div>
                        <div>
                            <Label htmlFor="capacite">Piéce livré P3</Label>
                            <Input type="text" id="capacite" />
                        </div>

                        <div>
                            <Label htmlFor="responsable">Piéce livré Fournisseur </Label>
                            <Input type="text" id="responsable" />
                        </div>
                    </div>
                    <div>
                        <DatePicker
                            id="date-maintenance"
                            label="Mois"
                            placeholder="Select a date"
                            onChange={(dates, currentDateString) => {
                                console.log({ dates, currentDateString });
                            }}
                        />
                    </div>
                    <div className="flex items-center justify-center mt-6">
                        <button
                            onClick={() => alert(`Ajouter une Pièce Livrée`)}
                            className="px-3 py-2 text-sm text-white bg-blue-500 rounded shadow-md hover:bg-blue-700"
                            type="submit"
                        >
                            Ajouter une Pièce Livrée
                        </button>
                    </div>
                </ComponentCard>
            </div>
        </>
    );
}
