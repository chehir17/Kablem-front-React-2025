import { useState, useEffect } from "react";
import Label from "../form/Label";
import Select from "../form/Select";
import { Modal } from "../ui/modal";

interface EditPlanActionStatusProps {
  isOpen: boolean;
  onClose: () => void;
  planAction: {
    id_planaction: number;
    status: string;
    progress: number;
  } | null;
  onSave: (updated: { id_planaction: number; status: string; progress: number }) => void;
}

const EditPlanActionStatus: React.FC<EditPlanActionStatusProps> = ({
  isOpen,
  onClose,
  planAction,
  onSave,
}) => {
  const [status, setStatus] = useState("open");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (planAction) {
      setStatus(planAction.status);
      setProgress(planAction.progress);
    }
  }, [planAction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (planAction) {
      onSave({
        id_planaction: planAction.id_planaction,
        status,
        progress,
      });
      onClose();
    }
  };

  const optionsStatut = [
    { value: "open", label: "Open" },
    { value: "in progress", label: "In Progress" },
    { value: "done", label: "Done" },
    { value: "canceld", label: "Canceld" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-2">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-7">
        <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {planAction ? `Modifier le statut et la progression N° ${planAction.id_planaction}` : "Modifier"}
        </h4>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <Label>Progress</Label>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{progress}%</div>
          </div>

          <div>
            <Label>Statut</Label>
            <Select
              options={optionsStatut}
              placeholder="Sélectionner un statut"
              onChange={(value: any) => setStatus(value)}
              value={status}
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
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditPlanActionStatus;
