// TextBoxWithButton.tsx
import React, { useState, useEffect } from "react";
import { TextField, InputAdornment, IconButton, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import "./Commercial_TextboxWithButton.css";

interface TextBoxWithButtonProps {
  onSend: (message: string) => void;
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

  useEffect(() => {
    if (listening) {
      startListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  const handleSend = async () => {
    if (message.trim() !== "") {
      onSend(message);
      // Send user input to the Flask backend
      try {
        const response = await fetch("/process_input", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_input: message }),
        });

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
      handleSend();
    }
  };
  return (
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
      borderTop="2px solid #f2f2f2"
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
                  onClick={handleSend}
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
  );
};

export default TextBoxWithButton;
