import Papa from "papaparse";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Export CSV
export const exportToCSV = <T>(data: T[], fileName: string = "table-data") => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${fileName}.csv`);
};

// Export Excel
export const exportToExcel = <T>(data: T[], fileName: string = "table-data") => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
};
