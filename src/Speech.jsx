// import React, { useState, useEffect } from "react";

// const Speech = () => {
//   const [isListening, setIsListening] = useState(false);
//   const [transcript, setTranscript] = useState("");
//   const [response, setResponse] = useState("");
//   let recognition = null;

//   useEffect(() => {
//     if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
//       recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//       recognition.continuous = false;
//       recognition.lang = "en-US";

//       recognition.onresult = (event) => {
//         const speechResult = event.results[0][0].transcript;
//         setTranscript(speechResult);
//         handleCommand(speechResult);
//       };

//       recognition.onerror = (event) => {
//         console.error("Speech recognition error:", event.error);
//       };
//     }
//   }, []);

//   const startListening = () => {
//     if (recognition) {
//       setIsListening(true);
//       recognition.start();
//     } else {
//       alert("Speech recognition is not supported on this browser.");
//     }
//   };

//   const stopListening = () => {
//     if (recognition) {
//       setIsListening(false);
//       recognition.stop();
//     }
//   };

//   const handleCommand = (command) => {
//     let reply = "I didn't understand that.";
//     if (command.toLowerCase().includes("hello")) {
//       reply = "Hello! How can I assist you today?";
//     } else if (command.toLowerCase().includes("weather")) {
//       reply = "Fetching the weather...";
//     }
//     setResponse(reply);
//     speak(reply);
//   };

//   const speak = (message) => {
//     if ("speechSynthesis" in window) {
//       const utterance = new SpeechSynthesisUtterance(message);
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Voice Assistant</h2>
//       <button onClick={startListening} disabled={isListening} className="mr-2">
//         Start Listening
//       </button>
//       <button onClick={stopListening} disabled={!isListening}>
//         Stop Listening
//       </button>
//       <p className="mt-4">Transcript: {transcript}</p>
//       <p className="mt-2 font-bold">Response: {response}</p>
//     </div>
//   );
// };

// export default Speech;
import React, { useState, useEffect, useRef } from "react";

const Speech = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const recognition = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.current.continuous = false;
      recognition.current.lang = "en-US";

      recognition.current.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        handleCommand(speechResult);
      };

      recognition.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognition.current.onend = () => {
        setIsListening(false); 
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognition.current) {
      alert("Speech recognition is not supported on this browser.");
      return;
    }
    if (isListening) {
      recognition.current.stop();
    } else {
      recognition.current.start();
    }
    setIsListening(!isListening);
  };

  const handleCommand = (command) => {
    let reply = "I didn't understand that.";
    if (command.toLowerCase().includes("hello")) {
      reply = "Hello! How can I help you?";
    } else if (command.toLowerCase().includes("weather")) {
      reply = "Fetching the weather...";
    }
    setResponse(reply);
    speak(reply);
  };

  const speak = (message) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "en-US";
      utterance.rate = 1.0; // Normal speech rate
      utterance.pitch = 1.0; // Normal pitch

      // Ensure speech doesn't overlap
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Voice Assistant</h2>
      <button onClick={toggleListening} className="px-4 py-2 bg-blue-500 text-white rounded">
        {isListening ? "Stop Listening" : "Start Listening"}
      </button>
      <p className="mt-4">Transcript: {transcript}</p>
      <p className="mt-2 font-bold">Response: {response}</p>
    </div>
  );
};

export default Speech;

// import React, { useState, useEffect } from "react";

// const Speech = () => {
//   const [isListening, setIsListening] = useState(false);
//   const [transcript, setTranscript] = useState("");
//   const [response, setResponse] = useState("");
//   const [recognition, setRecognition] = useState(null);

//   useEffect(() => {
//     if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
//       const recog = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//       recog.continuous = false;
//       recog.lang = "en-US";

//       recog.onresult = (event) => {
//         const speechResult = event.results[0][0].transcript;
//         setTranscript(speechResult);
//         handleCommand(speechResult);
//       };

//       recog.onerror = (event) => {
//         console.error("Speech recognition error:", event.error);
//       };

//       recog.onend = () => {
//         setIsListening(false); // Ensure the button updates when recognition stops
//       };

//       setRecognition(recog);
//     }
//   }, []);

//   const toggleListening = () => {
//     if (!recognition) {
//       alert("Speech recognition is not supported on this browser.");
//       return;
//     }
//     if (isListening) {
//       recognition.stop();
//     } else {
//       recognition.start();
//     }
//     setIsListening(!isListening);
//   };

//   const handleCommand = (command) => {
//     let reply = "I didn't understand that.";
//     if (command.toLowerCase().includes("hello")) {
//       reply = "Hello! How can I assist you today?";
//     } else if (command.toLowerCase().includes("weather")) {
//       reply = "Fetching the weather...";
//     }
//     setResponse(reply);
//     speak(reply);
//   };

//   const speak = (message) => {
//     if ("speechSynthesis" in window) {
//       const utterance = new SpeechSynthesisUtterance(message);
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Voice Assistant</h2>
//       <button onClick={toggleListening} className="px-4 py-2 bg-blue-500 text-white rounded">
//         {isListening ? "Stop Listening" : "Start Listening"}
//       </button>
//       <p className="mt-4">Transcript: {transcript}</p>
//       <p className="mt-2 font-bold">Response: {response}</p>
//     </div>
//   );
// };

// export default Speech;
