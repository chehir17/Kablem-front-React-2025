import { useState } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import { Dropdown } from "../ui/dropdown/Dropdown";

interface SendMessageProps {
    isOpen: boolean;
    onClose: () => void;
}

const SendMessage: React.FC<SendMessageProps> = ({ isOpen, onClose }) => {
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Message envoyé:", {message});
        onClose();
    };

    return (
        <Dropdown
            isOpen={isOpen}
            onClose={onClose}
            className="absolute right-0 mt-2 w-[350px] h-auto mx-5 flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:w-[380px]"
        >
            <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                Envoyer un message
            </h4>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                    <Label>Nom</Label>
                    <Input type="text" id="nom" name="name" placeholder="nom" />
                </div>
                <div>
                    <Label>Email</Label>
                    <Input type="email" id="titre" name="from_name" placeholder="text@gmail.com" />
                </div>
                <div>
                    <Label>Objet</Label>
                    <Input type="text" id="titre" name="titre" placeholder="Sujet" />
                </div>
                <div>
                    <Label>Message</Label>
                    <TextArea
                        rows={4}
                        onChange={(val) => setMessage(val)}
                        value={message}
                    />
                </div>

                <div className="flex justify-end gap-3 mt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
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
        </Dropdown>
    );
};

export default SendMessage;
