import React, { useState } from "react";

const ExcelControls = () => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      const res = await fetch("http://localhost:3000/api/users/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      alert(data.message || "Upload success");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = () => {
    window.open("http://localhost:3000/api/users/template", "_blank");
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
      <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        {uploading ? "Uploading..." : "Upload Excel"}
        <input
          type="file"
          accept=".xlsx"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>

      <button
        onClick={handleDownload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Download Sample Excel
      </button>
    </div>
  );
};

export default ExcelControls;
