// src/utils/fileUtils.ts
export const handleFileChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  field: string,
  setFormData: React.Dispatch<React.SetStateAction<any>>,
  setErrors: React.Dispatch<React.SetStateAction<any>>
) => {
  const file = event.target.files?.[0];
  if (file) {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: "Le fichier doit être au format PDF, DOC, DOCX ou CSV.",
      }));
      setFormData((prev: any) => ({ ...prev, [field]: null }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: "La taille du fichier doit être inférieure à 5 Mo.",
      }));
      setFormData((prev: any) => ({ ...prev, [field]: null }));
      return;
    }

    setFormData((prev: any) => ({ ...prev, [field]: file }));
    setErrors((prev: any) => ({ ...prev, [field]: "" }));
  }
};
