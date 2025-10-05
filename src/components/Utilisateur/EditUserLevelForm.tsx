import React, { useState, useEffect } from "react";
import Label from "../form/Label";
import Select from "../form/Select";
import { Modal } from "../ui/modal";

interface EditUserLevelRoleFormProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id_user: number;
    level: string;
    role: string;
  } | null;
  onSave: (updatedUser: {
    id_user: number;
    level: string;
    role: string;
  }) => void;
}

export default function EditUserLevelRoleForm({
  isOpen,
  onClose,
  user,
  onSave,
}: EditUserLevelRoleFormProps) {
  const [formData, setFormData] = useState({
    id_user: 0,
    level: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (field: "level" | "role", value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
    console.log("Utilisateur mis à jour :", formData);
    onClose();
  };

  const levelOptions = [
    { value: "high", label: "High level" },
    { value: "medium", label: "Medium level" },
  ];

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "agent_qualite", label: "Agent qualité" },
    { value: "user", label: "Utilisateur simple" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] m-2">
      <div className="relative w-full max-w-[500px] rounded-3xl bg-white dark:bg-gray-900 p-6">
        <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
          Modifier le niveau et le rôle
        </h4>

        <form className="flex flex-col gap-6">
          <div>
            <Label>Niveau</Label>
            <Select
              options={levelOptions}
              placeholder="Sélectionner un niveau"
              onChange={(value) => handleChange("level", value)}
              value={formData.level}
            />
          </div>

          <div>
            <Label>Rôle</Label>
            <Select
              options={roleOptions}
              placeholder="Sélectionner un rôle"
              onChange={(value) => handleChange("role", value)}
              value={formData.role}
            />
          </div>

          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-3 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
