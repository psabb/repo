// ChatComponent.tsx
import React, { useState, useEffect, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import CheckIcon from "@mui/icons-material/Check";
import yourImage from "../../assets/per.png";
import theirImage from "../../assets/rob.jpg";

interface ChatComponentProps {
  messages: Message[];
  showCheckIcon: boolean;
  copyToClipboard: (content: React.ReactNode) => void;
}

interface Message {
  sender: "user" | "system";
  content: string | React.ReactNode;
  loading?: boolean;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  messages,
  copyToClipboard,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showCheckIcon, setShowCheckIcon] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
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
              msg.sender === "system" && msg.loading ? "loading-chip" : ""
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
  );
};

export default ChatComponent;
