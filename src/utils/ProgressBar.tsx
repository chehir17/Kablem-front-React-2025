import React from "react";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  let colorClass = "bg-blue-600"; 

  if (progress < 30) {
    colorClass = "bg-red-500"; 
  } else if (progress < 70) {
    colorClass = "bg-yellow-500"; 
  } else {
    colorClass = "bg-green-500";
  }

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className={`h-2.5 rounded-full ${colorClass}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
