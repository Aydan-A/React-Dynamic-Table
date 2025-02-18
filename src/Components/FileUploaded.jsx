import React from "react";
import * as XLSX from "xlsx";

export default function UploadExcel({ setData }) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (jsonData.length < 2) return;

      // Standardize headers by removing special spaces and replacing spaces with underscores
      const headers = jsonData[0].map((header) =>
        header
          .trim()
          .normalize("NFKC")  // Fix hidden characters
          .replace(/\s+/g, "_") // Replace spaces with underscores
          .replace(/[^\w]/g, "") // Remove all non-alphanumeric characters
      );

      // Convert rows to an array of objects
      const formattedData = jsonData.slice(1).map((row) => {
        let obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || "";
        });
        return obj;
      });

      console.log("Final Data from Excel:", formattedData); // Debugging
      setData(formattedData);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />
    </div>
  );
}
