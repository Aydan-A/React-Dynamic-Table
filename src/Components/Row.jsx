import React, { useState } from "react";

function Row({ row, isEditable, onChange, onEdit, onDelete, searchTerm }) {
  const [showManualInput, setShowManualInput] = useState({});

  const highlightText = (text) => {
    if (!text) return '';
    if (!searchTerm) return text;
    const textStr = String(text);
    const parts = textStr.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ?
        <span key={i} className="highlight">{part}</span> :
        part
    );
  };

  const handleSelectChange = (key, value) => {
    if (value === 'Other') {
      setShowManualInput(prev => ({ ...prev, [key]: true }));
    } else {
      setShowManualInput(prev => ({ ...prev, [key]: false }));
      onChange({ ...row, [key]: value });
    }
  };

  const handleManualInput = (key, value) => {
    onChange({ ...row, [key]: value });
  };

  const renderEditableCell = (key, value) => {
    if (showManualInput[key]) {
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => handleManualInput(key, e.target.value)}
          className="editable-input"
          placeholder={`Enter ${key.replace(/_/g, ' ')}`}
        />
      );
    }

    // Normalize the key by removing both underscores and spaces for comparison
    const normalizedKey = key.replace(/[_\s]/g, '');

    switch (normalizedKey) {
      case 'ProductCategory':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleSelectChange(key, e.target.value)}
            className="editable-input"
          >
            <option value="">Select Category</option>
            <option value="Coffee Machine">Coffee Machine</option>
            <option value="Grinder">Grinder</option>
            <option value="Accessories">Accessories</option>
            <option value="Parts">Parts</option>
            <option value="Other">Other</option>
          </select>
        );
      case 'Brand':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleSelectChange(key, e.target.value)}
            className="editable-input"
          >
            <option value="">Select Brand</option>
            <option value="Ascaso">Ascaso</option>
            <option value="Keurig">Keurig</option>
            <option value="Rocket">Rocket</option>
            <option value="Lelit">Lelit</option>
            <option value="Other">Other</option>
          </select>
        );
      case 'Model':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleSelectChange(key, e.target.value)}
            className="editable-input"
          >
            <option value="">Select Model</option>
            <option value="Duo">Duo</option>
            <option value="Solo">Solo</option>
            <option value="Elite">Elite</option>
            <option value="Pro">Pro</option>
            <option value="Mini">Mini</option>
            <option value="Other">Other</option>
          </select>
        );
      case 'Colour':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleSelectChange(key, e.target.value)}
            className="editable-input"
          >
            <option value="">Select Colour</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Silver">Silver</option>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
            <option value="Other">Other</option>
          </select>
        );
      case 'ReadyStatus':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleSelectChange(key, e.target.value)}
            className="editable-input"
          >
            <option value="">Select Ready Status</option>
            <option value="Ready">Ready</option>
            <option value="In Progress">In Progress</option>
            <option value="Other">Other</option>
          </select>
        );
      case 'MachineStatus':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleSelectChange(key, e.target.value)}
            className="editable-input"
          >
            <option value="">Select Status</option>
            <option value="Done-sold">Done-sold</option>
            <option value="Waiting for parts">Waiting for parts</option>
            <option value="To be listed as open box">To be listed as open box</option>
            <option value="Pending in house repair">Pending in house repair</option>
            <option value="To be sent to manufacturer">To be sent to manufacturer</option>
            <option value="Done - Sent back to customer">Done - Sent back to customer</option>
            <option value="Done - Unsalvageable (to be used for parts)">Done - Unsalvageable (to be used for parts)</option>
            <option value="Done - Refunded by manufacturer">Done - Refunded by manufacturer</option>
            <option value="Other">Other</option>
          </select>
        );
      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange({ ...row, [key]: e.target.value })}
            className="editable-input"
          />
        );
    }
  };

  return (
    <tr>
      {Object.entries(row).map(([key, value]) => (
        <td key={key}>
          {isEditable ? (
            renderEditableCell(key, value)
          ) : (
            <span>{highlightText(value)}</span>
          )}
        </td>
      ))}
      <td className="action-buttons">
        <button onClick={onEdit} className="edit-button">
          Edit ✏️
        </button>
        <button onClick={onDelete} className="delete-button">
          Delete 🗑️
        </button>
      </td>
    </tr>
  );
}

export default Row;
