import { useEffect, useState } from "react";
import Label from "../form/Label";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import Checkbox from "../form/input/Checkbox";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import { Utilisateur } from "../../types/Utilisateur";
import { Departement } from "../../types/Departement";
import { DepartementService } from "../../services/DepartementService";
import { UserService } from "../../services/UserService";
import { NotifService } from "../../services/NotifService";

interface SendNotifProps {
    isOpen: boolean;
    onClose: () => void;
}

const SendNotification: React.FC<SendNotifProps> = ({ isOpen, onClose }) => {
    const [sendByUser, setSendByUser] = useState(false);
    const [sendByDept, setSendByDept] = useState(false);
    const [departements, setDepartements] = useState<Departement[]>([]);
    const [user, setUser] = useState<Utilisateur[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [formData, setFormData] = useState<any>({
        id_notif: "",
        titre: "",
        body: "",
        visibility: 0,
        id_user: null,
        departement: null,
    });

    // Charger départements et utilisateurs
    const fetchDepartements = async () => {
        try {
            const data = await DepartementService.getDepartements();
            setDepartements(data);
        } catch (err) {
            console.error("Impossible de charger les départements.", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const users = await UserService.getUsers();
            setUser(users);
        } catch (err) {
            console.error("Impossible de charger les utilisateurs.", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartements();
        fetchUsers();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const handleSelectChange = (
        option: { value: string; label: string } | string,
        field: string
    ) => {
        const value = typeof option === "string" ? option : option?.value;
        setFormData({ ...formData, [field]: value });
        setErrors({ ...errors, [field]: "" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        setErrors({ ...errors, [id]: "" });
    };

    const validateForm = () => {
        let newErrors: any = {};

        if (!formData.titre) newErrors.titre = "Le titre est requis";
        if (!formData.body) newErrors.body = "Le message est requis";
        if (!formData.id_user && sendByUser)
            newErrors.id_user = "Le nom d'utilisateur est requis";
        if (!formData.departement && sendByDept)
            newErrors.departement = "Le département est requis";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNotif = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            console.log("📤 Données envoyées :", formData);

            await NotifService.createNotif(formData);
            onClose();
            swal({
                title: "Succès !",
                text: "La Notification a été envoyée avec succès.",
                icon: "success",
            }).then(() => {
                window.location.href = "/historique-taches";
            });
        } catch (err) {
            console.error("Erreur d’ajout :", err);
            onClose();
            swal("Erreur", "Une erreur est survenue lors de l’envoi.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-2">
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
                <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Envoyer une Notification
                </h4>

                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    {/* Checkboxes */}
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

                    {/* Sélections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sendByUser && (
                            <div>
                                <Label>Envoi par utilisateur</Label>
                                <Select
                                    options={
                                        user.length > 0
                                            ? user.map((u) => ({
                                                value: String(u.id_user),
                                                label: u.first_name + " " + u.last_name,
                                            }))
                                            : [{ value: "", label: "Aucun utilisateur disponible" }]
                                    }
                                    placeholder={loading ? "Chargement..." : "Sélectionner"}
                                    onChange={(val) => handleSelectChange(val, "id_user")}
                                />
                                {errors.id_user && (
                                    <p className="text-red-500 text-sm">{errors.id_user}</p>
                                )}
                            </div>
                        )}
                        {sendByDept && (
                            <div>
                                <Label>Envoi par département</Label>
                                <Select
                                    options={
                                        departements.length > 0
                                            ? departements.map((dep) => ({
                                                value: String(dep.id_departement),
                                                label: dep.nom_departement,
                                            }))
                                            : [{ value: "", label: "Aucun département disponible" }]
                                    }
                                    placeholder={loading ? "Chargement..." : "Sélectionner"}
                                    onChange={(val) => handleSelectChange(val, "departement")}
                                />
                                {errors.departement && (
                                    <p className="text-red-500 text-sm">{errors.departement}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Champ titre */}
                    <div>
                        <Label htmlFor="titre">Titre</Label>
                        <Input
                            type="text"
                            id="titre"
                            value={formData.titre}
                            onChange={handleChange}
                            error={!!errors.titre}
                            success={!!formData.titre && !errors.titre}
                        />
                        {errors.titre && (
                            <p className="text-red-500 text-sm">{errors.titre}</p>
                        )}
                    </div>

                    {/* Textarea corrigé */}
                    <div>
                        <Label htmlFor="body">Message</Label>
                        <TextArea
                            id="body"
                            rows={6}
                            value={formData.body}
                            onChange={(value) =>
                                setFormData((prev: any) => ({ ...prev, body: value }))
                            }
                            className={`border rounded-md w-full p-2 transition ${errors.body
                                ? "border-red-500 focus:ring-error-500/20"
                                : formData.body
                                    ? "border-green-500 focus:ring-success-500/20"
                                    : "border-gray-300 focus:ring-blue-500/20"
                                }`}
                        />
                        {errors.body && (
                            <p className="text-red-500 text-sm">{errors.body}</p>
                        )}
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={handleNotif}
                            className={`px-6 py-2 text-sm text-white rounded-lg shadow-md transition ${loading
                                ? "bg-blue-300 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            disabled={loading}
                        >
                            {loading ? "⏳ Envoi..." : "Envoyer"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default SendNotification;
