import React, { useState, useEffect } from "react";

function Dropdown({ className, label, options, selectedOption, onOptionChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => {
        setIsOpen(false);
      }, 5000); // 5 seconds of inactivity
      setTimeoutId(id);
    } else if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }, [isOpen]);

  return (
    <div className={`dropdown ${className}`}>
      <label className="dropdown-label" onClick={toggleDropdown}>
        {label} 
        <span className="dropdown-value">{selectedOption} </span>
        <span className={`arrow ${isOpen ? "open" : ""}`}>▼</span>
      </label>
      <div className={`buttons-container ${isOpen ? "show" : ""}`}>
        {options.map((option) => (
          <button
            key={option.value}
            className={selectedOption === option.value ? "active" : "outlined"}
            onClick={() => {
              onOptionChange(option.value);
              setIsOpen(false);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Dropdown;