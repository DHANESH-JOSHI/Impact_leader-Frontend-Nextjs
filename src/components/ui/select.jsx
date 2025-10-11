"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

const SelectContext = React.createContext();

const Select = ({ value, onValueChange, children, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value || '');

  React.useEffect(() => {
    setSelectedValue(value || '');
  }, [value]);

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  return (
    <SelectContext.Provider value={{
      selectedValue,
      handleValueChange,
      isOpen,
      setIsOpen
    }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen, setIsOpen } = React.useContext(SelectContext);

  return (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef(({ className, placeholder, ...props }, ref) => {
  const { selectedValue } = React.useContext(SelectContext);

  return (
    <span className={`pointer-events-none ${className}`} ref={ref} {...props}>
      {selectedValue || placeholder}
    </span>
  );
});
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen } = React.useContext(SelectContext);

  if (!isOpen) return null;

  return (
    <div
      className={`absolute top-full left-0 z-50 min-w-full overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md mt-1 ${className}`}
      ref={ref}
      {...props}
    >
      <div className="max-h-60 overflow-auto p-1">
        {children}
      </div>
    </div>
  );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => {
  const { handleValueChange, selectedValue } = React.useContext(SelectContext);

  return (
    <div
      className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 ${selectedValue === value ? 'bg-blue-50 text-blue-600' : ''} ${className}`}
      ref={ref}
      onClick={() => handleValueChange(value)}
      {...props}
    >
      {children}
    </div>
  );
});
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };