// TextBoxWithButton.tsx
import React, { useState, useEffect } from "react";
import { TextField, InputAdornment, IconButton, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import "./Commercial_TextboxWithButton.css";

interface TextBoxWithButtonProps {
  onSend: (message: string, storedVectorStoreName: string | null) => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

const TextBoxWithButton: React.FC<TextBoxWithButtonProps> = ({ onSend }) => {
  const [message, setMessage] = useState<string>("");
  const [listening, setListening] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const storedVectorStoreName: string | null = null;

  useEffect(() => {
    if (listening) {
      startListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  const handleSend = async (
    message: string,
    storedVectorStoreName: string | null
  ) => {
    if (message.trim() !== "") {
      onSend(message, storedVectorStoreName);
      // Send user input to the Flask backend
      try {
        const requestBody = {
          user_input: message,
          vector_store_name: storedVectorStoreName,
        };

        const response = await fetch(
          "https://github-backend.azurewebsites.net/process_input",
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
          // Update the component state or perform other actions based on the response
          console.log(responseData.generated_response);
        } else {
          console.error("Failed to process input");
        }
      } catch (error) {
        console.error("Error sending request:", error);
      }

      // Clear the input after sending

      setMessage("");
    }
  };

  const handleMicClick = () => {
    setListening(!listening);
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("Listening...");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setMessage((prevMessage) => prevMessage + transcript);
    };

    recognition.onend = () => {
      console.log("Stopped listening");
      setListening(false);
    };

    recognition.start();
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend(message, storedVectorStoreName);
    }
  };
  return (
    <>
      <Box
        component="div"
        position="fixed"
        bottom="0"
        left="50%"
        marginLeft="-50%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        p="16px"
        bgcolor="white"
        borderBottom="2px solid #f2f2f2"
        marginBottom="30px"
      >
        <TextField
          variant="outlined"
          id="outlined-error"
          size="small"
          value={message}
          placeholder="Type or Ask your Query"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          classes={{ root: isFocused ? "focusedTextField" : "" }}
          style={{ width: "60%" }}
          InputProps={{
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleMicClick}
                    edge="end"
                    color={listening ? "warning" : "default"}
                    className="iconButton"
                  >
                    <MicIcon />
                  </IconButton>
                </InputAdornment>
                <InputAdornment position="end">
                  <IconButton
                    onClick={(event) => {
                      event.preventDefault();
                      handleSend(message, storedVectorStoreName);
                    }}
                    edge="end"
                    className="iconButton"
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              </>
            ),
          }}
        />
      </Box>
      <Box
        component="div"
        position="fixed"
        bottom="0"
        left="50%"
        marginLeft="-50%"
        display="flex"
        flexDirection="row"
        alignItems="flex-end"
        justifyContent="flex-end"
        width="100%"
        p="5px"
        bgcolor="white"
        borderTop="2px solid #f2f2f2"
        color="red"
      >
        <a
          href="https://forms.office.com/e/n6hG5kQ34C"
          target="_blank"
          className="hover-link"
          rel="noreferrer"
        >
          Feedback
        </a>
        <a href="/" className="hover-link">
          Contact Us
        </a>
        &#169;ABB PAEN 2024
      </Box>
    </>
  );
};

export default TextBoxWithButton;
