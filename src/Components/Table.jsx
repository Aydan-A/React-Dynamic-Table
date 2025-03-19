import React, { useState, useEffect } from "react";
import Row from "./Row";
import UploadExcel from "./FileUploaded";
import products from "../data/Products.json";

export default function Table() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [isFilterVisible, setIsFilterVisible] = useState({});
  const [editableRows, setEditableRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [backupData, setBackupData] = useState([]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("data"));
    if (savedData && savedData.length > 0) {
      setData(savedData);
    }
  }, []);

  const saveToLocalStorage = (dataToSave) => {
    try {
      const serializedData = JSON.stringify(dataToSave);
      localStorage.setItem("data", serializedData);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const saveBackup = () => {
    try {
      const cleanData = JSON.parse(JSON.stringify(data));
      setBackupData((prev) => [...prev, cleanData]);
    } catch (error) {
      console.error("Error saving backup:", error);
    }
  };


  const handleAddRow = () => {
    saveBackup();
    const newRow = data.length > 0
      ? Object.keys(data[0]).reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {})
      : {
        "RMA": "",
        "Order_Number": "",
        "Clients_Name": "",
        "Product_Category": "",
        "Brand": "",
        "Model": "",
        "Colour": "",
        "Ready_Status": "",
        "Machine_Status": "",
        "Issue": "",
        "Refund_Exchange_Restock_Upgrade": "",
        "Further_Notes": ""
      };

    setData([...data, newRow]);
    setEditableRows([...editableRows, data.length]);
  };

  const handleRowChange = (index, updatedRow) => {
    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedRow };
      return updatedData;
    });
  };

  const handleEdit = (index) => setEditableRows([...editableRows, index]);

  const handleDelete = (index) => {
    saveBackup();
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
    saveToLocalStorage(updatedData);
  };

  const handleSearch = () => {
    const filteredData = data.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString()?.toLowerCase()?.includes(searchTerm.toLowerCase())
      )
    );
    setData(filteredData);
  };

  const resetSearch = () => {
    setSearchTerm("");
    const savedData = JSON.parse(localStorage.getItem("data")) || [];
    setData(savedData);
  };

  const getUniqueOptions = (column) => {
    return [...new Set(data.map((row) => row[column]?.toString().trim()))].filter(
      (option) => option !== undefined && option !== ""
    );
  };

  const toggleFilterVisibility = (column) => {
    setIsFilterVisible((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleFilterChange = (column, value) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
  };

  const applyFilters = () => {
    const filteredData = data.filter((row) =>
      Object.keys(filters).every((key) =>
        filters[key]
          ? row[key]?.toString()?.toLowerCase()?.includes(filters[key].toLowerCase())
          : true
      )
    );
    setData(filteredData);
  };

  const handleSaveAll = () => {
    try {
      saveBackup();
      const cleanData = data.map(row => ({ ...row }));
      setData(cleanData);
      saveToLocalStorage(cleanData);
      setEditableRows([]);
      alert("All data saved successfully!");
    } catch (error) {
      console.error("Error saving all changes:", error);
      alert("Error saving changes. Please try again.");
    }
  };

  const handleUndo = () => {
    if (backupData.length > 0) {
      const lastBackup = backupData[backupData.length - 1];
      setBackupData((prev) => prev.slice(0, -1));
      setData(lastBackup);
      saveToLocalStorage(lastBackup);
      setEditableRows([]);
    } else {
      alert("No more undo actions available.");
    }
  };

  return (
    <div>
      <div className="header-section">
        <div className="header-content">
          <h1>Machine Return Tracker</h1>
          <div className="upload-section">
            <h2>Upload Excel File:</h2>
            <UploadExcel setData={setData} />
          </div>

          <div className="action-buttons-container">
            <button type="button" className="save-all-button" onClick={handleSaveAll}>
              Save All Changes ✅
            </button>
            <button type="button" className="undo-button" onClick={handleUndo}>
              Undo 🔄
            </button>
          </div>

          <div className="search-container">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search all columns..."
              className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
              Search 🔍
            </button>
            <button onClick={resetSearch} className="reset-search">
              Reset🔄
            </button>
          </div>
        </div>
      </div>

      {data.length > 0 && (
        <>
          <div className="table-wrapper">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    {Object.keys(data[0] || {}).map((header) => (
                      <th key={header}>
                        {header.replace(/_/g, " ")}
                        <span
                          className="filter-icon"
                          onClick={() => toggleFilterVisibility(header)}
                          style={{ cursor: "pointer", marginLeft: "10px" }}
                        >
                          🔽
                        </span>
                        {isFilterVisible[header] && (
                          <div className="filter-input">
                            <select
                              value={filters[header] || ""}
                              onChange={(e) => handleFilterChange(header, e.target.value)}
                            >
                              <option value="">All</option>
                              {getUniqueOptions(header).map((option, index) => (
                                <option key={index} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            <button onClick={applyFilters} className="apply-button">
                              Apply
                            </button>
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {data.map((row, index) => (
                    <Row
                      key={index}
                      row={row}
                      isEditable={editableRows.includes(index)}
                      onChange={(updatedRow) => handleRowChange(index, updatedRow)}
                      onEdit={() => handleEdit(index)}
                      onDelete={() => handleDelete(index)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="buttons">
            <button type="button" className="add-row-button" onClick={handleAddRow}>
              Add Row ➕
            </button>
          </div>
        </>
      )}
    </div>
  );
}
