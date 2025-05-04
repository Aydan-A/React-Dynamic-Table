import React, { useState, useEffect } from "react";
import Row from "./Row";
import UploadExcel from "./FileUploaded";
import * as XLSX from "xlsx";



export default function Table() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});
  const [isFilterVisible, setIsFilterVisible] = useState({});
  const [editableRows, setEditableRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [backupData, setBackupData] = useState([]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("data"));
    if (savedData && savedData.length > 0) {
      setData(savedData);
      setFilteredData(savedData);
    }
  }, []);

  const handleDataUpdate = (newData) => {
    setData(newData);
    setFilteredData(newData);
    setSearchTerm("");
    setFilters({});
    setIsFilterVisible({});
    setEditableRows([]);
  };

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
      setBackupData(prev => [...prev, cleanData]);
    } catch (error) {
      console.error("Error saving backup:", error);
    }
  };

  const handleSearch = () => {
    saveBackup();
    const filtered = data.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString()?.toLowerCase()?.includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const resetSearch = () => {
    saveBackup();
    setSearchTerm("");
    setFilteredData(data);
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
    setFilteredData([...filteredData, newRow]);
    setEditableRows([...editableRows, data.length]);
  };

  const handleRowChange = (index, updatedRow) => {
    saveBackup();
    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedRow };
      return updatedData;
    });
    setFilteredData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedRow };
      return updatedData;
    });
  };

  const handleEdit = (index) => {
    saveBackup();
    setEditableRows([...editableRows, index]);
  };

  const handleDelete = (index) => {
    saveBackup();
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
    setFilteredData(updatedData);
    saveToLocalStorage(updatedData);
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
    saveBackup();
    const filtered = data.filter((row) =>
      Object.keys(filters).every((key) =>
        filters[key]
          ? row[key]?.toString()?.toLowerCase()?.includes(filters[key].toLowerCase())
          : true
      )
    );
    setFilteredData(filtered);
  };

  const handleSaveAll = () => {
    try {
      saveBackup();
      const cleanData = data.map(row => ({ ...row }));
      setData(cleanData);
      setFilteredData(cleanData);
      saveToLocalStorage(cleanData);
      setEditableRows([]);
      // Auto-dismiss alert after 2 seconds
      const alertElement = document.createElement('div');
      alertElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      `;
      alertElement.textContent = "All data saved successfully!";
      document.body.appendChild(alertElement);
      setTimeout(() => alertElement.remove(), 2000);
    } catch (error) {
      console.error("Error saving all changes:", error);
      alert("Error saving changes. Please try again.");
    }
  };

  const handleUndo = () => {
    if (backupData.length > 0) {
      const lastBackup = backupData[backupData.length - 1];
      setData(lastBackup);
      setFilteredData(lastBackup);
      setBackupData(prev => prev.slice(0, -1));
      saveToLocalStorage(lastBackup);
      setEditableRows([]);
      setSearchTerm("");
      setFilters({});
      setIsFilterVisible({});
    } else {
      alert("No more undo actions available.");
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData.length > 0 ? filteredData : data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TableData");
    XLSX.writeFile(wb, "MachineReturnTable.xlsx");
  };


  return (
    <div>
      <div className="header-section">
        <div className="header-content">
          <h1>Machine Return Tracker</h1>
          <div className="upload-section">
            <h2>Upload Excel File:</h2>
            <UploadExcel setData={handleDataUpdate} />
          </div>

          {data.length > 0 && (
            <>
              <div className="action-buttons-container">
                <button type="button" className="save-all-button" onClick={handleSaveAll}>
                  Save All Changes ✅
                </button>
                <button type="button" className="undo-button" onClick={handleUndo}>
                  Undo 🔄
                </button>
                <button type="button" className="export-button" onClick={handleExport}>
                  Export to Excel 📤
                </button>

              </div>

              <div className="search-container">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
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
            </>
          )}
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
                        {["Product_Category", "Brand", "Model", "Colour", "Ready_Status", "Machine_Status"].includes(header) && (
                          <>
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
                          </>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((row, index) => (
                      <Row
                        key={index}
                        row={row}
                        isEditable={editableRows.includes(index)}
                        onChange={(updatedRow) => handleRowChange(index, updatedRow)}
                        onEdit={() => handleEdit(index)}
                        onDelete={() => handleDelete(index)}
                        searchTerm={searchTerm}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={Object.keys(data[0] || {}).length + 1} className="no-results">
                        Sorry, there is no data matching your search.
                      </td>
                    </tr>
                  )}
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
