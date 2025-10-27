import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface ActionOption {
  label: string;
  onClick: () => void;
}

interface ActionMenuProps {
  options: ActionOption[];
  hidden?: boolean; 
}

const ActionMenu: React.FC<ActionMenuProps> = ({ options, hidden = false }) => {
  const [open, setOpenMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom,
        left: rect.left,
      });
    }
    setOpenMenu((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(false);
    if (open) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  if (hidden) return null;

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          ref={buttonRef}
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-1 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600"
          onClick={handleButtonClick}
        >
          Actions
          <svg
            className="-mr-1 ml-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {open &&
        createPortal(
          <div
            className="fixed z-[9999]"
            style={{ top: menuPosition.top, left: menuPosition.left }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setOpenMenu(false);
                      option.onClick();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default ActionMenu;
