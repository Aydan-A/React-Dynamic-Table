import React, { memo } from "react";

function Row({ row, isEditable, onChange, onEdit, onDelete, onSave }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...row, [name]: value });
  };

  return (
    <tr>
      <td>
        {isEditable ? (
          <input type="text" name="RMA" value={row.RMA || ""} onChange={handleChange} />
        ) : (
          row.RMA
        )}
      </td>
      <td>
        {isEditable ? (
          <input type="text" name="Order_Number" value={row.Order_Number || ""} onChange={handleChange} />
        ) : (
          row.Order_Number
        )}
      </td>
      <td>
        {isEditable ? (
          <input type="text" name="Clients_Name" value={row.Clients_Name || ""} onChange={handleChange} />
        ) : (
          row.Clients_Name
        )}
      </td>
      <td>
        {isEditable ? (
          <select name="Product_Category" value={row.Product_Category || ""} onChange={handleChange}>
            <option value="">Select Category</option>
            <option value="Coffee Machine">Coffee Machine</option>
            <option value="Grinder">Grinder</option>
            <option value="Accessories">Accessories</option>
          </select>
        ) : (
          row.Product_Category
        )}
      </td>
      <td>
        {isEditable ? (
          <select name="Brand" value={row.Brand || ""} onChange={handleChange}>
            <option value="">Select Brand</option>
            <option value="Ascaso">Ascaso</option>
            <option value="Keurig">Keurig</option>
            <option value="Rocket">Rocket</option>
            <option value="Lelit">Lelit</option>
          </select>
        ) : (
          row.Brand
        )}
      </td>
      <td>
        {isEditable ? (
          <input type="text" name="Model" value={row.Model || ""} onChange={handleChange} />
        ) : (
          row.Model
        )}
      </td>
      <td>
        {isEditable ? (
          <input type="text" name="Colour" value={row.Colour || ""} onChange={handleChange} />
        ) : (
          row.Colour
        )}
      </td>
      <td>
        {isEditable ? (
          <select name="Ready_Status" value={row.Ready_Status || ""} onChange={handleChange}>
            <option value="">Select Ready Status</option>
            <option value="Ready">Ready</option>
            <option value="In Progress">In Progress</option>
          </select>
        ) : (
          row.Ready_Status
        )}
      </td>
      <td>
        {isEditable ? (
          <select name="Machine_Status" value={row.Machine_Status || ""} onChange={handleChange}>
            <option value="">Select Status</option>
            <option value="Done-sold">Done-sold</option>
            <option value="Waiting for parts">Waiting for parts</option>
            <option value="To be listed as open box">To be listed as open box</option>
            <option value="Pending in house repair">Pending in house repair</option>
            <option value="To be sent to manufacturer">To be sent to manufacturer</option>
            <option value="Done - Sent back to customer">Done - Sent back to customer</option>
            <option value="Done - Unsalvageable (to be used for parts)">Done - Unsalvageable (to be used for parts)</option>
            <option value="Done - Refunded by manufacturer">Done - Refunded by manufacturer</option>
          </select>
        ) : (
          row.Machine_Status
        )}
      </td>
      
      <td>
        {isEditable ? (
          <input type="text" name="Issue" value={row.Issue || ""} onChange={handleChange} />
        ) : (
          row.Issue
        )}
      </td>
      <td>
        {isEditable ? (
          <input type="text" name="Refund_Exchange_Restock_Upgrade" value={row.Refund_Exchange_Restock_Upgrade || ""} onChange={handleChange} />
        ) : (
          row.Refund_Exchange_Restock_Upgrade
        )}
      </td>
      <td>
        {isEditable ? (
          <input type="text" name="Further_Notes" value={row.Further_Notes || ""} onChange={handleChange} />
        ) : (
          row.Further_Notes
        )}
      </td>
      <td className="action-buttons">
        <button className="edit-button" onClick={onEdit}>✎</button>
        <button className="delete-button" onClick={onDelete}>🗑</button>
        <button type="button" className="save-button" onClick={onSave}>Save ✅</button>
      </td>
    </tr>
  );
}

export default memo(Row);
