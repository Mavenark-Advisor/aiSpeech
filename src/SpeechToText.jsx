// import React, { useState, useEffect } from "react";

// const SpeechRecognition =
//   window.SpeechRecognition || window.webkitSpeechRecognition;

// const VoiceRecognition = () => {
//   const [text, setText] = useState("");
//   const [isListening, setIsListening] = useState(false);
//   const [isSupported, setIsSupported] = useState(true);

//   let recognition;

//   useEffect(() => {
//     if (!SpeechRecognition) {
//       setIsSupported(false);
//       return;
//     }

//     recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = "en-US";

//     recognition.onresult = (event) => {
//       const transcript = Array.from(event.results)
//         .map((result) => result[0].transcript)
//         .join("");
//       setText(transcript);
//     };

//     recognition.onend = () => setIsListening(false);
//     recognition.onerror = (event) => console.error("Speech error:", event);
//   }, []);

//   const startListening = () => {
//     if (!SpeechRecognition) {
//       alert("Speech recognition is not supported in this browser.");
//       return;
//     }
//     setIsListening(true);
//     recognition.start();
//   };

//   const stopListening = () => {
//     if (recognition) {
//       setIsListening(false);
//       recognition.stop();
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "20px" }}>
//       <h2>Cross-Platform Speech-to-Text</h2>
//       {isSupported ? (
//         <>
//           <button onClick={startListening} disabled={isListening}>
//             🎤 Start Listening
//           </button>
//           <button onClick={stopListening} disabled={!isListening}>
//             🛑 Stop
//           </button>
//           <p><strong>Recognized Text:</strong> {text}</p>
//         </>
//       ) : (
//         <p>⚠️ Speech recognition is not supported in your browser.</p>
//       )}
//     </div>
//   );
// };

// export default VoiceRecognition;

import React, { useState, useEffect } from "react";

const SpeechToText = () => {
  const [text, setText] = useState(""); // Stores the transcribed text
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);

  let recognition;

  useEffect(() => {
    // Check if browser supports Speech Recognition
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setSupported(false);
      return;
    }

    // Initialize Speech Recognition API
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true; // Keeps listening continuously
    recognition.interimResults = true; // Shows words as they're spoken
    recognition.lang = "en-US"; // Set language (can change as needed)

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setText(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setListening(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Speech-to-Text (Device Friendly)</h2>
      {!supported ? (
        <p style={{ color: "red" }}>Your browser does not support Speech Recognition.</p>
      ) : (
        <>
          <button
            onClick={startListening}
            style={{
              padding: "10px",
              margin: "10px",
              backgroundColor: listening ? "red" : "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {listening ? "Listening..." : "Start"}
          </button>
          <button
            onClick={stopListening}
            style={{
              padding: "10px",
              margin: "10px",
              backgroundColor: "black",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Stop
          </button>
          <p style={{ fontSize: "18px", marginTop: "20px" }}><strong>Text:</strong> {text}</p>
        </>
      )}
    </div>
  );
};

export default SpeechToText;
