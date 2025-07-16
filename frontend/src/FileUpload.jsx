// src/FileUpload.js
import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCloudUploadAlt } from "react-icons/fa"; // Import an icon for the upload button
import "./FileUpload.css";
const FileUpload = ({ d, setx, r, setdetails }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(""); // Clear message when a new file is selected
  };

  const onFileUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setUploading(true); // Show uploading status
    const formData = new FormData();
    formData.append("file", file);
    formData.append("reason", d);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploading(false);
      setdetails(response.data.message);
      setx(r);
      setMessage("File uploaded successfully.");
    } catch (error) {
      setUploading(false);
      setMessage("File upload failed. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h3 className="text-center mb-4">Upload Your File</h3>

          <div className="card p-4 shadow-sm">
            <div className="mb-3">
              <label className="form-label">Choose File to Upload</label>
              <div className="custom-file-input-wrapper">
                <input
                  type="file"
                  id="fileUpload"
                  className="custom-file-input"
                  onChange={onFileChange}
                />
                <label htmlFor="fileUpload" className="custom-file-label">
                  <FaCloudUploadAlt className="me-2" />
                  {file ? file.name : "Choose File"}
                </label>
              </div>
            </div>

            <button
              className="btn btn-primary w-100"
              onClick={onFileUpload}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <FaCloudUploadAlt className="me-2" /> Uploading...
                </>
              ) : (
                <>
                  <FaCloudUploadAlt className="me-2" /> Upload
                </>
              )}
            </button>

            {message && (
              <div
                className={`alert mt-3 ${
                  uploading ? "alert-info" : "alert-success"
                }`}
                role="alert"
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
