import React from "react";
import * as XLSX from "xlsx";

export default function UploadExcel({ setData }) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Normalize column names
      const formattedData = jsonData.map((row) => ({
        RMA: row["RMA"] || "",
        OrderNumber: row["Order Number"] || "",
        ClientName: row["Client's Name"] || "",
        ProductCategory: row["Product Category"] || "",
        Brand: row["Brand"] || "",
        Model: row["Model"] || "",
        MachineStatus: row["Machine status"] || "",
        ReadyStatus: row["Ready/ In Progress"] || "",
        Issue: row["Issue/Tracking number"] || "",
        RefundExchangeRestockUpgrade:
          row["Refund/Exchange/Restock/Upgrade"] || "",
        FurtherNotes: row["Further Notes"] || "",
      }));

      // Save to localStorage
      localStorage.setItem("excelData", JSON.stringify(formattedData));

      // Update table data
      setData(formattedData);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />
    </div>
  );
}
