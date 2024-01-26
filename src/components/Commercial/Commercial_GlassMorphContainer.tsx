// GlassMorphContainer.tsx
import React, { useState, useEffect, useRef } from "react";
import "./Commercial_GlassMorphContainer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TextBoxWithButton from "./Commercial_TextboxWithButton";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import yourImage from "../../assets/per.png";
import theirImage from "../../assets/rob.jpg";
import FileUploadService from "../../services/FileUploadService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import UploadService from "../../services/FileUploadService";
import IFile from "../../types/File";
import "./FileUpload.css";
import { Dispatch, SetStateAction } from "react";
import BouncingDotsLoader from "./BouncingLoader";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import CheckIcon from "@mui/icons-material/Check";
import ReactDropdown from "react-beautiful-dropdown";
import optionsMap, { OptionsMap, Question } from "./optionsData";

interface GlassMorphContainerProps {
  children: React.ReactNode;
  isSideMenuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

interface Message {
  sender: "user" | "system";
  content: string | React.ReactNode;
  loading?: boolean;
}

const GlassMorphContainer: React.FC<GlassMorphContainerProps> = ({
  children,
  setMenuOpen,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentFile, setCurrentFile] = useState<File | undefined>(undefined);
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [fileInfos, setFileInfos] = useState<IFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showCheckIcon, setShowCheckIcon] = useState(false);
  const [uploadButtonClicked, setUploadButtonClicked] =
    useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedRadioButton, setSelectedRadioButton] = useState("option1");

  const currentOptions: Question[] =
    optionsMap[selectedRadioButton as keyof typeof optionsMap];

  const inputHandler = (val: string) => {
    setSelectedOption(val);
    handleMessageSend(val);
    setSelectedOption("");
  };

  const renderSystemResponse = (response: string | React.ReactNode) => {
    if (response === undefined) {
      return (
        <span style={{ color: "red" }}>
          An error occurred. Either the engine you requested does not exist or
          there was another issue processing your request.
        </span>
      ); // Display this message for undefined responses
    }
    if (typeof response === "string") {
      // Use Markdown-like syntax for bold characters and lists
      return response
        .replace(
          /\*\*(.*?)\*\*/g,
          (_, content) => `<strong>${content}</strong>`
        )
        .replace(/^\s*-\s*(.*)$/gm, (_, content) => `<li>${content}</li>`)
        .replace(/^\s*<\/?p>\s*$/gm, ""); // Remove empty paragraphs
    }
    return response;
  };

  const copyToClipboard = (content: React.ReactNode) => {
    // Extract HTML content from ReactNode
    const htmlContent = typeof content === "string" ? content : String(content);

    // Create a temporary element to copy HTML content
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlContent;

    // Extract text content and preserve bold formatting
    const formattedText = Array.from(tempElement.childNodes)
      .map((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.nodeValue || "";
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          if (
            element.style.fontWeight === "bold" ||
            element.tagName === "STRONG"
          ) {
            return `**${element.textContent}**`;
          } else if (element.tagName === "P") {
            return "\n" + (element.textContent || "");
          }
          return element.textContent || "";
        }
        return "";
      })
      .join("");

    // Trim the entire formatted text to remove extra spaces
    const trimmedText = formattedText.trim();

    // Create a textarea to copy text content
    const textField = document.createElement("textarea");
    textField.value = trimmedText;

    // Append textarea to the body, select, copy, and remove
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    document.body.removeChild(textField);
  };

  const handleMessageSend = async (userMessage: string) => {
    try {
      if (!userMessage || userMessage.trim() === "") {
        return;
      }

      console.log("Message sent:", userMessage);

      // Start loading immediately
      const userMessageObj: Message = { sender: "user", content: userMessage };
      setMessages((prevMessages) => [...prevMessages, userMessageObj]);

      // Display loading spinner for user message
      const userLoadingMessageObj: Message = {
        sender: "system",
        content: <BouncingDotsLoader />,
        loading: true,
      };
      setMessages((prevMessages) => [...prevMessages, userLoadingMessageObj]);

      // Check if the user is trying to upload, but no document is selected
      if (userMessage.toLowerCase() === "upload" && !currentFile) {
        setMessage(
          "Please upload the document before sending the 'upload' command."
        );
        return;
      }

      if (userMessage.toLowerCase() === "upload" && currentFile) {
        await FileUploadService.upload(currentFile, (event: any) => {
          setProgress(Math.round((100 * event.loaded) / event.total));
        });
      }

      if (selectedOption) {
        const dropdownUserMessage: Message = {
          sender: "user",
          content: selectedOption,
        };
        console.log("Dropdown User Message:", dropdownUserMessage);
        setMessages((prevMessages) => [...prevMessages, dropdownUserMessage]);
      }

      // Fetch system response
      const systemResponse = await fetchSystemResponse(userMessage);

      // Hide loading spinner for user message
      setMessages((prevMessages) => {
        const index = prevMessages.findIndex(
          (msg) => msg.sender === "system" && msg.loading
        );
        if (index !== -1) {
          const updatedMessages = [...prevMessages];
          updatedMessages.splice(index, 1); // Remove the loading message
          return [
            ...updatedMessages,
            {
              sender: "system",
              content: renderSystemResponse(systemResponse),
              loading: false,
            },
          ];
        }
        return prevMessages;
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const fetchSystemResponse = async (userMessage: string) => {
    try {
      const response = await fetch("/process_input", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_input: userMessage }),
      });

      if (response.ok) {
        const responseData = await response.json();
        return responseData.generated_response;
      } else {
        console.error("Failed to fetch system response");
        return "Error: Unable to fetch system response";
      }
    } catch (error) {
      console.error("Error fetching system response:", error);
      return "Error: Unable to fetch system response";
    }
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await UploadService.getFiles();
        setFileInfos(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const selectedFile = files?.[0];

    if (selectedFile) {
      setCurrentFile(selectedFile);
      setProgress(0);
      setMessage("");

      // Clear the file input value
      event.target.value = "";
    }
  };

  const upload = () => {
    setLoading(true);
    setProgress(0);

    if (!currentFile) {
      setLoading(false);
      return;
    }

    UploadService.upload(currentFile, (event: any) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        setMessage("File uploaded successfully");
        console.log("File uploaded successfully");
        setMenuOpen(true);
        setMessages([]);
        setUploadButtonClicked(true);
        scrollToBottom();
        return UploadService.getFiles();
      })
      .then((files) => {
        setFileInfos(files.data);
        setTimeout(() => {
          clearMessage();
        }, 15000);
      })
      .catch((err) => {
        setProgress(0);

        if (err.response && err.response.data && err.response.data.message) {
          // Use a more descriptive error message if available
          setMessage(err.response.data.message);
          setTimeout(() => {
            clearMessage();
          }, 5000);
        } else if (
          err.message === "Invalid file type. Allowed types: pdf, doc, docx"
        ) {
          // Handle specific error for invalid file format
          setMessage("Invalid file format. Allowed formats: PDF, DOC, DOCX");
          setTimeout(() => {
            clearMessage();
          }, 5000);
        } else {
          setMessage("Could not upload the file!");
          setTimeout(() => {
            clearMessage();
          }, 5000);
        }
      })
      .finally(() => {
        setLoading(false); // Set loading to false regardless of success or error
      });
  };

  const deleteFile = async () => {
    if (currentFile) {
      try {
        setCurrentFile(undefined);
        setMessage("File deleted successfully");

        // Update fileInfos after deletion
        const files = await UploadService.getFiles();
        setFileInfos(files.data);
        setTimeout(() => {
          clearMessage();
        }, 5000);
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  const clearMessage = () => {
    setMessage("");
  };

  return (
    <>
      <div className="glass-morph-wrapper">
        <div className="glass-morph-container">
          {children}

          <div className="greeting">
            <p>How Can I Help You Today ?</p>
          </div>
          <div className="glass-morph-insidecontainer">
            <p>Upload Your Document :</p>
            <div>
              <div className="row">
                <div className="col-8">
                  <label className="btn btn-default p-0">
                    <input type="file" multiple onChange={selectFile} />
                  </label>
                </div>

                <div className="col-1">
                  <FontAwesomeIcon
                    icon={faTrash}
                    className={`text-danger cursor-pointer ${
                      !currentFile ? "disabled" : ""
                    }`}
                    onClick={deleteFile}
                    style={{ marginLeft: 50, height: 20, marginTop: 5 }}
                  />
                </div>

                <div>
                  <button
                    className="btn btn-danger btn-sm upload"
                    disabled={!currentFile || loading} // Disable button when loading
                    onClick={upload}
                    style={{ marginLeft: "70px" }}
                  >
                    Upload
                  </button>
                </div>
              </div>

              {currentFile && (
                <div className="progress progress-lg my-3">
                  <div
                    className="progress-bar progress-bar-info"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    style={{ width: `${progress}%` }}
                  >
                    {currentFile.name}
                  </div>
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
                  <div
                    className="spinner"
                    style={{ marginRight: "10px" }}
                  ></div>
                  <span className="process">Processing</span>
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
                    message === "File uploaded successfully"
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
            {uploadButtonClicked && (
              <div>
                <input
                  type="radio"
                  name="option"
                  value="option2"
                  onChange={() => setSelectedRadioButton("option2")}
                />{" "}
                Commercial <span style={{ marginLeft: "10px" }} />
                <input
                  type="radio"
                  name="option"
                  value="option3"
                  onChange={() => setSelectedRadioButton("option3")}
                />{" "}
                Technical <span style={{ marginLeft: "10px" }} />
                <input
                  type="radio"
                  name="option"
                  value="option4"
                  onChange={() => setSelectedRadioButton("option4")}
                />{" "}
                Legal <span style={{ marginLeft: "10px" }} />
                <span style={{ marginLeft: "10px" }} />
                <input
                  type="radio"
                  name="option"
                  value="option1"
                  style={{ color: "red" }}
                  defaultChecked
                  onChange={() => setSelectedRadioButton("option1")}
                />
                Others
                <span style={{ marginLeft: "10px" }} />
                <ReactDropdown
                  value={selectedOption}
                  options={currentOptions}
                  valueHandler={inputHandler}
                  placeholder="Suggested Questions for the user"
                  error={{ isError: false, errorText: "Error" }}
                  customInputStyles={{
                    border: "2px solid gray",
                    borderRadius: "5px",
                    padding: "8px",
                  }}
                  customDropdownItemStyles={{
                    backgroundColor: "white",
                    color: "black",
                    marginLeft: "-40px",
                    listStyle: "none",
                  }}
                />
              </div>
            )}
          </div>

          <br />

          {messages.length > 0 ? (
            <div className="chat-container">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-bubble ${
                    msg.sender === "user" ? "sender" : "received"
                  }`}
                >
                  {/* Avatar for Receiver */}
                  {msg.sender === "system" && (
                    <div className="avatar-container">
                      <Avatar>
                        <img
                          src={theirImage}
                          alt={`${msg.sender.charAt(0).toUpperCase()} Avatar`}
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </Avatar>
                    </div>
                  )}

                  {/* Chip */}
                  <Chip
                    label={
                      typeof msg.content === "string" ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderSystemResponse(msg.content) || "",
                          }}
                          style={{ fontSize: "14px" }}
                        />
                      ) : (
                        msg.content
                      )
                    }
                    variant="outlined"
                    className={`${
                      msg.sender === "system" && msg.loading
                        ? "loading-chip"
                        : ""
                    }`}
                  />

                  {/* Copy icon for system messages (moved below the chip) */}
                  {msg.sender === "system" &&
                    typeof msg.content === "string" &&
                    msg.content !== "Information Not Available" &&
                    msg.content !== "Information Not Available." &&
                    msg.content.trim() !== "" &&
                    !msg.loading && (
                      <div style={{ marginTop: "5px" }}>
                        {showCheckIcon ? (
                          <CheckIcon
                            className="CheckIcon"
                            style={{
                              width: "16px",
                              height: "16px",
                              marginLeft: "4px",
                            }}
                          />
                        ) : (
                          <FileCopyIcon
                            className="FileCopyIcon"
                            style={{
                              width: "14px",
                              height: "14px",
                              marginLeft: "4px",
                            }}
                            onClick={() => {
                              copyToClipboard(msg.content);
                              setShowCheckIcon(true);
                              setTimeout(() => {
                                setShowCheckIcon(false);
                              }, 2000);
                            }}
                          />
                        )}
                      </div>
                    )}

                  {/* Avatar for User */}
                  {msg.sender === "user" && (
                    <div
                      className="avatar-container"
                      style={{ order: 2, marginLeft: "5px" }}
                    >
                      <Avatar>
                        <img
                          src={yourImage}
                          alt={`${msg.sender.charAt(0).toUpperCase()} Avatar`}
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </Avatar>
                    </div>
                  )}
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>
          ) : null}
        </div>
      </div>

      <TextBoxWithButton onSend={handleMessageSend} />
    </>
  );
};

export default GlassMorphContainer;