import { useState } from "react";
import { Modal } from "../components/ui/modal";

type ModalPreviewProps = {
  label: string;
  title: string; 
  content: string; 
  maxLength?: number; 
};

export default function ModalPreview({
  label,
  title,
  content,
  maxLength = 20,
}: ModalPreviewProps) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <span
        className="cursor-pointer underline text-blue-600"
        onClick={() => setOpenModal(true)}
      >
        {label.length > maxLength ? label.slice(0, maxLength) + "..." : label}
      </span>

      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        className="max-w-md"
      >
        <div className="p-4">
          <h4 className="text-lg font-semibold mb-2 dark:text-gray-200">
            {title}
          </h4>
          <p className="dark:text-gray-200">{content}</p>
          <button
            onClick={() => setOpenModal(false)}
            className="mt-4 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Fermer
          </button>
        </div>
      </Modal>
    </>
  );
}
