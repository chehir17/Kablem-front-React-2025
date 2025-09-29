import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface DownloadChartProps {
  chartRef?: any;
  containerId?: string;
  fileName?: string;
  type?: "png" | "pdf";
}

const DownloadChart: React.FC<DownloadChartProps> = ({
  chartRef,
  containerId,
  fileName = "chart",
  type = "png",
}) => {
  const handleDownload = async () => {
    if (type === "png" && chartRef?.current) {
      // Télécharger en PNG
      const chartInstance = chartRef.current;
      const url = chartInstance.toBase64Image();
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.png`;
      link.click();
    }

    if (type === "pdf" && containerId) {
      // Télécharger en PDF
      const input = document.getElementById(containerId);
      if (input) {
        const canvas = await html2canvas(input);
        const img = canvas.toDataURL("image/png");
        const pdf = new jsPDF("l", "pt", "a4");
        pdf.addImage(img, "PNG", 20, 20, 800, 500);
        pdf.save(`${fileName}.pdf`);
      }
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-3 py-2 bg-blue-600 text-xs text-white rounded shadow hover:bg-blue-700"
    >
      Télécharger {type.toUpperCase()}
    </button>
  );
};

export default DownloadChart;
