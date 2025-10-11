import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import ComponentCard from "../common/ComponentCard.tsx";
import Select from "../form/Select.tsx";
import { useState } from "react";
import { ClientService } from "../../services/ClientService.tsx";
import swal from "sweetalert";

export default function AddClientForm() {
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    id_client: "",
    nom_client: "",
    ref: "",
    societe: "",
    email: "",
    status: "",
  });

  const options = [
    { value: "actif", label: "Actif" },
    { value: "inactif", label: "Inactif" },
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

    if (!formData.nom_client) newErrors.nom_client = "Le nom du client est requis";
    if (!formData.ref) newErrors.ref = "La référence est requise";
    if (!formData.societe) newErrors.societe = "La société est requise";
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email invalide";
    }
    if (!formData.status) newErrors.status = "Le statut est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClient = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true); // ✅ activer le loading
      console.log("📤 Données envoyées :", formData);

      const res = await ClientService.createClient(formData);

      swal({
        title: "Succès !",
        text: "Le client a été ajouté avec succès.",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });
    } catch (err) {
      console.error("❌ Erreur d’ajout :", err);
      swal("Erreur", "Une erreur est survenue lors de l’ajout.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentCard title="Ajouter un Client">
      <div className="space-y-6">
        <div>
          <Label htmlFor="nom_client">Nom du Client</Label>
          <Input
            type="text"
            id="nom_client"
            onChange={handleChange}
            error={!!errors.nom_client}
            success={!!formData.nom_client}
          />
          {errors.nom_client && <p className="text-red-500 text-sm">{errors.nom_client}</p>}
        </div>

        <div>
          <Label htmlFor="ref">Référence du Client</Label>
          <Input
            type="text"
            id="ref"
            onChange={handleChange}
            error={!!errors.ref}
            success={!!formData.ref}
          />
          {errors.ref && <p className="text-red-500 text-sm">{errors.ref}</p>}
        </div>

        <div>
          <Label htmlFor="societe">Société / Organisme</Label>
          <Input
            type="text"
            id="societe"
            onChange={handleChange}
            error={!!errors.societe}
            success={!!formData.societe}
          />
          {errors.societe && <p className="text-red-500 text-sm">{errors.societe}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="info@gmail.com"
            onChange={handleChange}
            error={!!errors.email}
            success={!!formData.email}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div>
          <Label>Status</Label>
          <Select
            options={options}
            placeholder="Sélectionner un statut"
            onChange={(val) => handleSelectChange(val, "status")}
            className="dark:bg-dark-900"
          />
          {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
        </div>
      </div>

      <div className="flex items-center justify-center mt-6">
        <button
          type="button"
          onClick={handleClient}
          className={`px-6 py-2 text-sm text-white rounded-lg shadow-md transition ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          disabled={loading}
        >
          {loading ? "⏳ Enregistrement..." : "Sauvegarder"}
        </button>
      </div>
    </ComponentCard>
  );
}
