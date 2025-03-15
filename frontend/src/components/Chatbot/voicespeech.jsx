import { useState } from "react";
import { Mic, MicOff } from "lucide-react";

const VoiceSearch = ({ onSearch }) => {
    const [isListening, setIsListening] = useState(false);
    let speechDetected = false;

    const startListening = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.error("Speech recognition is not supported in this browser.");
            alert("Speech recognition is not supported in your browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            console.log("Listening...");
            setIsListening(true);
        };

        recognition.onend = () => {
            console.log("Stopped listening");
            setIsListening(false);
            if (!speechDetected) {
                alert("No speech detected! Try again");
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            speechDetected = true;
            console.log("Recognized Speech:", transcript);
            onSearch(transcript);
        };

        recognition.start();
    };

    return (
        <button onClick={startListening} className={`mic-button ${isListening ? "listening" : ""}`}>
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
    );
};

export default VoiceSearch;
