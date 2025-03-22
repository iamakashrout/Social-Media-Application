import React, { useState } from "react";
import { IconButton } from "@mui/material";
import { Mic, MicOff } from "lucide-react";

const Voice_Search = ({ onSearch }) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    setIsListening(true);
    // const recognition = new window.webkitSpeechRecognition();
    const recognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
    ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    : null;

if (!recognition) {
  alert("Your browser does not support speech recognition.");
}

    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      let voiceText = event.results[0][0].transcript;
      voiceText = voiceText.trim().replace(/[.,!?;:]$/, ""); // Remove trailing punctuation
      onSearch(voiceText); // Pass result to Navbar
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };
  };

  return (
    <IconButton onClick={startListening}>
      {isListening ? <MicOff /> : <Mic />}
    </IconButton>
  );
};

export default Voice_Search;
