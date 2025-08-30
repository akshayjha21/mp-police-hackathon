import React, { useState } from "react";
import { uploadIPDRFile } from "../api/ipdrApi";

const UploadIPDRFile = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const result = await uploadIPDRFile(file);
    if (result) {
      setMessage("Upload successful");
    } else {
      setMessage("Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload IPDR File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadIPDRFile;
