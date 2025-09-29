import React, { useState } from "react";
import { Filter } from "../icons";
import { motion, AnimatePresence } from "framer-motion";

interface DynamicFiltersProps {
  filters: Record<string, string>;
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fields: { name: string; placeholder: string }[];
}

const DynamicFilters: React.FC<DynamicFiltersProps> = ({
  filters,
  onFilterChange,
  fields,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1 my-1 text-xs text-white bg-success-500 rounded hover:bg-success-700 hover:shadow-xl transition-shadow duration-200"
      >
        <Filter className="w-4 h-4" />
        {open ? "Fermer les filtres" : "Filtres"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 border rounded-lg bg-white shadow-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:focus:border-brand-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fields.map((field) => (
                  <input
                    key={field.name}
                    type="text"
                    name={field.name}
                    placeholder={field.placeholder}
                    value={filters[field.name] || ""}
                    onChange={onFilterChange}
                    className="border px-2 py-1 rounded dark:border-gray-700"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DynamicFilters;
