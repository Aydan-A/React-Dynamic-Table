import React from "react";
import * as XLSX from "xlsx";

export default function UploadExcel({ setData }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const bstr = event.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Convert the data to the required format
      const headers = data[0];
      const rows = data.slice(1).map((row) => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || "";
        });
        return obj;
      });

      // Update both data and filteredData
      setData(rows);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <input
      type="file"
      accept=".xlsx, .xls"
      onChange={handleFileUpload}
      className="file-input"
    />
  );
}
