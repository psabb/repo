// GlassMorphInsideContainer.tsx
import React from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

interface GlassMorphInsideContainerProps {
  currentFiles: File[];
  loading: boolean;
  uploadingFileNames: string[];
  uploadButtonClicked: boolean;
  selectedOption: string;
  transformedOptions: { value: string; label: string }[];
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  onCategorySelect: (categoryValue: number) => void;
  onInputHandler: (label: any) => void;
  clearMessage: () => void;
  message: string;
  processing: boolean;
}

const GlassMorphInsideContainer: React.FC<GlassMorphInsideContainerProps> = ({
  currentFiles,
  loading,
  uploadingFileNames,
  uploadButtonClicked,
  selectedOption,
  transformedOptions,
  onFileSelect,
  onUpload,
  onCategorySelect,
  onInputHandler,
  clearMessage,
  message,
  processing,
}) => {
  return (
    <div className="glass-morph-insidecontainer">
      <p>Please upload your document (.pdf, .docx formats only) :</p>
      <div>
        <div className="row">
          <div className="col-8">
            <label className="btn btn-default p-0">
              <input
                type="file"
                multiple
                onChange={onFileSelect}
                accept=".pdf,.docx"
              />
              {currentFiles.length > 0 && (
                <span style={{ marginLeft: "-190px" }}>{`${
                  currentFiles.length
                } ${
                  currentFiles.length === 1 ? "file" : "files"
                } selected, click on upload`}</span>
              )}
            </label>
          </div>

          <div>
            <button
              className="btn btn-danger btn-sm upload"
              disabled={!currentFiles || currentFiles.length === 0 || loading} // Disable button when loading
              onClick={onUpload}
              style={{ marginLeft: "90px" }}
            >
              Upload
            </button>
          </div>
        </div>

        {uploadingFileNames.length > 0 && (
          <div>
            <p style={{ marginTop: "10px" }}>Selected Files for Upload:</p>
            <ul>
              {uploadingFileNames.map((fileName, index) => (
                <li key={index}>
                  {fileName.length > 25
                    ? `${fileName.substring(0, 25)}...${fileName.substring(
                        fileName.lastIndexOf(".") + 1
                      )}`
                    : fileName}
                </li>
              ))}
            </ul>
          </div>
        )}

        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <div className="spinner" style={{ marginRight: "10px" }}></div>
            <span className="process">Uploading File</span>
            <div className="dots">
              {Array.from({ length: 3 }, (_, index) => (
                <span
                  className="running"
                  key={index}
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  {"."}
                </span>
              ))}
            </div>
          </div>
        )}

        {processing && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <div className="spinner" style={{ marginRight: "10px" }}></div>
            <span className="process">Processing File</span>
            <div className="dots">
              {Array.from({ length: 3 }, (_, index) => (
                <span
                  className="running"
                  key={index}
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  {"."}
                </span>
              ))}
            </div>
          </div>
        )}

        {message && (
          <div
            className={`alert ${
              message === "Files uploaded successfully"
                ? "alert-success"
                : "alert-secondary"
            } mt-3`}
            role="alert"
          >
            {message}
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={clearMessage}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}
      </div>

      <div>
        <br />
        {uploadButtonClicked && (
          <Dropdown
            value={selectedOption}
            options={transformedOptions}
            onChange={(option) => onInputHandler(option.label)}
            placeholder="Suggested Questions as per the category selected"
          />
        )}
      </div>
    </div>
  );
};

export default GlassMorphInsideContainer;
