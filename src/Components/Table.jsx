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

  const handleLoadJson = () => {
    setData(products);
  };

  const handleAddRow = () => {
    if (data.length === 0) return; 
    const newRow = Object.keys(data[0]).reduce((acc, key) => {
      acc[key] = "";
      return acc;
    }, {});
    setData([...data, newRow]);
    setEditableRows([...editableRows, data.length]);
  };

  const handleRowChange = (index, updatedRow) => {
    const updatedData = data.map((row, i) => (i === index ? updatedRow : row));
    setData(updatedData);
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

  const getUniqueOptions = (column) => {
    return [...new Set(data.map((row) => row[column]?.toString().trim()))].filter(
      (option) => option !== undefined && option !== ""
    );
  };


  const handleEdit = (index) => setEditableRows([...editableRows, index]);

  const handleDelete = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
    localStorage.setItem("data", JSON.stringify(updatedData));
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

  const handleSaveData = () => {
    localStorage.setItem("data", JSON.stringify(data));
    alert("Data saved successfully!");
  };

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);

  return (
    <div>
      <h2 style={{ fontSize: "14px" }}>Upload Excel File:</h2>
      <UploadExcel setData={setData} />
      <hr />
      <button className="load-json-button" onClick={handleLoadJson}>
        Load JSON Data 📂
      </button>
      <hr />
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
          Reset 🔄
        </button>
      </div>

      <table>
      <thead>
  <tr>
    {data.length > 0 &&
      Object.keys(data[0] || {}).map((header) => {
        const formattedHeader = header.replace(/_/g, " "); // Convert back to readable form
        return (
          <th key={header}>
            {formattedHeader}
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
        );
      })}
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
              onSave={handleSaveData}
            />
          ))}
        </tbody>
      </table>

      <div className="buttons">
        <button type="button" className="add-row-button" onClick={handleAddRow}>
          Add Row ➕
        </button>
      </div>
    </div>
  );
}
