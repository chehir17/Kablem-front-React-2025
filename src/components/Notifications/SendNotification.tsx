import { useState } from "react";
import Label from "../form/Label";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import Checkbox from "../form/input/Checkbox";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";

interface SendNotifProps {
    isOpen: boolean;
    onClose: () => void;
}

const SendNotification: React.FC<SendNotifProps> = ({ isOpen, onClose }) => {
    const [sendByUser, setSendByUser] = useState(false);
    const [sendByDept, setSendByDept] = useState(false);
    const [formData, setFormData] = useState();
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        };

    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // const { name, value } = e.target;
        // setFormData((prev) => ({
        //     ...prev,
        //     [name]: value,
        // }));
    };

    const optionsUtilisateur = [
        { value: "chehir", label: "chehir" },
        { value: "hamadi", label: "hamadi" },
    ];

    const departementOptions = [
        { value: "qualité", label: "Qualité" },
        { value: "dep_extrusion", label: "Département extrusion" },
        { value: "dep_cablage", label: "Département câblage" },
        { value: "dep_assemblage", label: "Département assemblage" },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-2">
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Envoyer Notification
                </h4>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <div className="flex items-center justify-between mr-30 ml-30">
                        <div className="flex items-center gap-3">
                            <Checkbox
                                checked={sendByUser}
                                onChange={() => setSendByUser(!sendByUser)}
                            />
                            <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Envoyer par Utilisateur
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox
                                checked={sendByDept}
                                onChange={() => setSendByDept(!sendByDept)}
                            />
                            <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Envoyer par Département
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sendByUser && (
                            <div>
                                <Label>Envoi par utilisateur</Label>
                                <Select
                                    options={optionsUtilisateur}
                                    placeholder="Sélectionner un Utilisateur"
                                    onChange={handleSelectChange}
                                />
                            </div>
                        )}
                        {sendByDept && (
                            <div>
                                <Label>Envoi par département</Label>
                                <Select
                                    options={departementOptions}
                                    placeholder="Sélectionner un Département"
                                    onChange={handleSelectChange}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <Label>Titre</Label>
                        <Input type="text" id="titre" name="titre" />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <TextArea
                            rows={6}
                            onChange={(value) => setMessage(value)}
                            value={message}
                        />
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Envoyer
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default SendNotification;
