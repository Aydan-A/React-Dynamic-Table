import React, { useState, useEffect } from "react";
import Row from "./Row";
import products from "../data/Products.json";
import UploadExcel from "./FileUploaded";

export default function Table() {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem("data");
    return savedData ? JSON.parse(savedData) : products;
  });

  const [filters, setFilters] = useState({});
  const [isFilterVisible, setIsFilterVisible] = useState({});
  const [editableRows, setEditableRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddRow = () => {
    const newRow = {
      RMA: "",
      OrderNumber: "",
      ClientName: "",
      ProductCategory: "",
      Brand: "",
      Model: "",
      Colour: "",
      ReadyStatus: "",
      MachineStatus: "",
      Issue: "",
      RefundExchangeRestockUpgrade: "",
      FurtherNotes: "",
      ActionsButtons: "",
    };
    setData((prevData) => [...prevData, newRow]);
      setEditableRows((prevEditableRows) => [...prevEditableRows, data.length]);
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
    const filteredData = products.filter((row) =>
      Object.keys(filters).every((key) =>
        filters[key]
          ? row[key]
              ?.toString()
              ?.toLowerCase()
              ?.includes(filters[key].toLowerCase())
          : true
      )
    );
    setData(filteredData);
  };

  const getUniqueOptions = (column) => {
    return [...new Set(products.map((row) => row[column]))].filter(
      (option) => option !== undefined && option !== ""
    );
  };

  const handleEdit = (index) => {
    setEditableRows((prev) => [...prev, index]);
  };

  const handleDelete = (index) => {
    const updatedData = data.filter((row, number) => number !== index);
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
    setData(products);
    setSearchTerm("");
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
      <div className="search-container" style={{ marginBottom: "15px" }}>
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
            {Object.keys(products[0]).map((header) => (
              <th key={header}>
                {header}
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
                      onChange={(e) =>
                        handleFilterChange(header, e.target.value)
                      }
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
              onSave={() => handleSaveData(index)}
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
