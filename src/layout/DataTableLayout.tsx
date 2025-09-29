import React, { useState } from "react";
import DataTable, { TableColumn, createTheme } from "react-data-table-component";
import { exportToCSV, exportToExcel } from "../utils/exportUtils";
import { useTheme } from "../context/ThemeContext";

createTheme(
  "darkCustom",
  {
    text: {
      primary: "#f3f4f6",
      secondary: "#9ca3af",
    },
    background: {
      default: "#111827",
    },
    context: {
      background: "#374151",
      text: "#ffffff",
    },
    divider: {
      default: "#374151",
    },
    action: {
      button: "rgba(255,255,255,.87)",
      hover: "rgba(255,255,255,.08)",
      disabled: "rgba(255,255,255,.12)",
    },
  },
  "dark"
);

type DataTableLayoutProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  title?: string;
};

export default function DataTableLayout<T>({
  columns,
  data,
  title,
}: DataTableLayoutProps<T>) {
  const [filterText, setFilterText] = useState("");
  const { theme } = useTheme();

  const filteredData = data.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="rounded border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 relative">
      {title && (
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
          {title}
        </h2>
      )}

      {/* Search bar */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        {/* Export buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(filteredData, title || "table-data")}
            className="px-3 py-2 text-sm text-white bg-green-500 rounded hover:bg-green-600"
          >
            Export CSV
          </button>
          <button
            onClick={() => exportToExcel(filteredData, title || "table-data")}
            className="px-3 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Export Excel
          </button>
        </div>
      </div>

      <DataTable
        key={theme}
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        responsive
        theme={theme === "dark" ? "darkCustom" : "light"}
      />
    </div>
  );
}
