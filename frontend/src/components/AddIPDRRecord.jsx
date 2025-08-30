import React, { useState } from "react";
import { addIPDRRecord } from "../api/ipdrApi";

const AddIPDRRecord = () => {
  const [record, setRecord] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setRecord(e.target.value);
  };

  const handleSubmit = async () => {
    let parsedRecord;
    try {
      parsedRecord = JSON.parse(record);
    } catch {
      setMessage("Invalid JSON format.");
      return;
    }

    const result = await addIPDRRecord(parsedRecord);
    if (result) setMessage("Record added successfully.");
    else setMessage("Failed to add the record.");
  };

  return (
    <div>
      <h2>Add IPDR Record</h2>
      <textarea
        rows={8}
        cols={50}
        placeholder='Enter IPDR record JSON here'
        value={record}
        onChange={handleChange}
      />
      <br />
      <button onClick={handleSubmit}>Add Record</button>
      <p>{message}</p>
    </div>
  );
};

export default AddIPDRRecord;
