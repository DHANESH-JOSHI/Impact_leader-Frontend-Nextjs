"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function CustomDropdown({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  className = "",
  minWidth = "140px",
  maxHeight = "200px",
  getOptionLabel = (option) => option.label || option.name || String(option),
  getOptionValue = (option) => option.value || option.name || String(option),
  getOptionKey = (option, index) => option._id || option.id || option.value || index,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(
    (option) => getOptionValue(option) === value
  );
  const selectedLabel = selectedOption
    ? getOptionLabel(selectedOption)
    : placeholder;

  const handleSelect = (option) => {
    const optionValue = getOptionValue(option);
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:border-transparent transition-all h-10 text-left flex items-center justify-between ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        style={{ 
          focusRingColor: "#2691ce",
          minWidth: minWidth 
        }}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform flex-shrink-0 ml-2 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          style={{ color: "#646464" }}
        />
      </button>
      {isOpen && !disabled && (
        <div
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
          style={{ maxHeight: maxHeight, overflowY: "auto" }}
        >
          {options.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500 text-center">
              No options available
            </div>
          ) : (
            options.map((option, index) => {
              const optionValue = getOptionValue(option);
              const optionLabel = getOptionLabel(option);
              const isSelected = value === optionValue;

              return (
                <button
                  key={getOptionKey(option, index)}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                    isSelected ? "bg-blue-50 font-medium" : ""
                  }`}
                >
                  {optionLabel}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
