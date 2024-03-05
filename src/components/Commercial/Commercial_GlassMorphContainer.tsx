// GlassMorphContainer.tsx
import React, { useState, useEffect, useRef } from "react";
import "./Commercial_GlassMorphContainer.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TextBoxWithButton from "./Commercial_TextboxWithButton";
import UploadService from "../../services/FileUploadService";
import "./FileUpload.css";
import { Dispatch, SetStateAction } from "react";
import BouncingDotsLoader from "./BouncingLoader";
import GlassMorphInsideContainer from "./GlassMorphInsideContainer";
import "react-dropdown/style.css";
import optionsMap, { Question } from "./optionsData";
import { Example } from "./MultiToggle";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalComponent from "./ModalComponent";
import ChatComponent from "./ChatComponent";

interface GlassMorphContainerProps {
  children: React.ReactNode;
  isSideMenuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  setstoredVectorStoreName: Dispatch<SetStateAction<string | null>>;
  setFileUploaded: Dispatch<SetStateAction<boolean>>;
}

interface Message {
  sender: "user" | "system";
  content: string | React.ReactNode;
  loading?: boolean;
}

const GlassMorphContainer: React.FC<GlassMorphContainerProps> = ({
  children,
  setstoredVectorStoreName,
  setFileUploaded,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentFile, setCurrentFile] = useState<File | undefined>(undefined);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [showCheckIcon, setShowCheckIcon] = useState(false);
  const [uploadButtonClicked, setUploadButtonClicked] =
    useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(2);
  const [localstoredVectorStoreName, setLocalStoredVectorStoreName] =
    useState(null);
  const [blobName, setBlobName] = useState<string>("");
  const [uploadingFileNames, setUploadingFileNames] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const currentOptions: Question[] =
    optionsMap[`option${selectedCategory}` as keyof typeof optionsMap] || [];

  const transformedOptions = currentOptions.map((question) => ({
    value: question.id,
    label: question.label,
  }));

  const inputHandler = (label: any) => {
    setSelectedOption(label);
    const storedVectorStoreName: string | null = null;
    handleMessageSend(label, storedVectorStoreName);
    setSelectedOption("");
  };

  const handleCategorySelect = (categoryValue: number) => {
    setSelectedCategory(categoryValue);
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
    document.execCommand("cop");
    document.body.removeChild(textField);
  };

  const handleMessageSend = async (
    userMessage: string,
    storedVectorStoreName: string | null
  ) => {
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

      console.log("System Response:", systemResponse);

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

  const triggerProcessFile = async (blobName: string) => {
    try {
      console.log("Triggering /processfile...");
      setProcessing(true);

      const bodyRequest = {
        blobName: blobName,
      };

      const response = await fetch(
        `https://rfqbackenddeployment.azurewebsites.net/processfile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyRequest),
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to trigger /processfile. Status:",
          response.status || "Unknown"
        );

        if (response.status === 404) {
          console.error("Endpoint not found");
        } else {
        }
        return;
      }

      const responseData = await response.json();
      const vectorStoreName = responseData.vector_store_names;
      console.log("Vector Store Name:", vectorStoreName);
      setLocalStoredVectorStoreName(vectorStoreName);
      setstoredVectorStoreName(vectorStoreName);
      console.log("Success:", responseData);
      return vectorStoreName;
    } catch (error) {
      console.error("Error triggering /processfile:", error);
    } finally {
      setProcessing(false);
    }
  };

  const fetchSystemResponse = async (userMessage: string) => {
    try {
      const requestBody = {
        user_input: userMessage,
        vector_store_name: localstoredVectorStoreName,
      };

      console.log(requestBody);

      const response = await fetch(
        "https://rfqbackenddeployment.azurewebsites.net/process_input",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        return responseData.generated_response;
      }

      console.error("Failed to fetch system response");
      return "Error: Unable to fetch system response";
    } catch (error) {
      console.error("Error fetching system response:", error);
      return "Error: Unable to fetch system response";
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadButtonClicked(false);
    const { files } = event.target;
    const selectedFiles = Array.from(files || []);

    if (selectedFiles.length > 0) {
      setCurrentFiles(selectedFiles);
      setMessage("");

      const fileNames = selectedFiles.map((file) => file.name);
      setUploadingFileNames(fileNames);

      // Clear the file input value
      event.target.value = "";
    }
  };

  const upload = async () => {
    if (isProcessing) {
      toast.error("Another file is already being processed. Please wait.");
      return;
    }

    setLoading(true);

    if (!currentFiles || currentFiles.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setIsProcessing(true); // Set processing state to true

      if (uploadButtonClicked) {
        toast.error(
          "Files have already been uploaded. Please select new files."
        );
        setLoading(false);
        return;
      }

      const response = await UploadService.upload(
        currentFiles,
        (event: any) => {}
      );
      const blobName = response.data.blob_name;
      setBlobName(blobName);
      console.log("BlobName after upload:", blobName);
      setLoading(false);
      await triggerProcessFile(blobName);
      setMessage("Files uploaded successfully");
      console.log("Files uploaded successfully");
      if (response.status === 200) {
        setFileUploaded(true); // Set the state indicating a successful upload
      }
      setMessages([]);
      setUploadButtonClicked(true);
      setTimeout(() => {
        clearMessage();
      }, 5000);
    } catch (error) {
      console.error("Error during upload:", error);
    } finally {
      setIsProcessing(false); // Reset processing state regardless of success or failure
    }
  };

  const clearMessage = () => {
    setMessage("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // useEffect to close the modal after a certain time
  useEffect(() => {
    const modalTimeout = setTimeout(() => {
      closeModal();
    }, 500000); // Adjust the time as needed

    return () => clearTimeout(modalTimeout);
  }, []);

  return (
    <>
      <div className="glass-morph-wrapper">
        <div className="glass-morph-container">
          {children}

          <div className="greeting">
            <p>How Can I Help You Today ?</p>
          </div>

          <Example onCategorySelect={handleCategorySelect} />

          <GlassMorphInsideContainer
            currentFiles={currentFiles}
            loading={loading}
            uploadingFileNames={uploadingFileNames}
            uploadButtonClicked={uploadButtonClicked}
            selectedOption={selectedOption}
            transformedOptions={transformedOptions}
            onFileSelect={selectFile}
            onUpload={upload}
            onCategorySelect={handleCategorySelect}
            onInputHandler={inputHandler}
            clearMessage={clearMessage}
            message={message} // Pass the message prop
            processing={processing} // Pass the processing prop
          />

          <br />

          {messages.length > 0 ? (
            <ChatComponent
              messages={messages}
              showCheckIcon={showCheckIcon}
              copyToClipboard={copyToClipboard}
            />
          ) : null}
        </div>
      </div>

      <TextBoxWithButton onSend={handleMessageSend} />
      <ModalComponent isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default GlassMorphContainer;
