import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const Speech = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("");
  const [voices, setVoices] = useState([]);
  const [processing, setProcessing] = useState(false);
  const recognition = useRef(null);

  const updateStatus = (text) => setStatus(text);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.current.continuous = false;
      recognition.current.lang = "en-US";

      recognition.current.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        processSpeechInput(speechResult);
      };

      recognition.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    loadVoices();
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

  const speakMessage = useCallback(
    (text, callback) => {
      if (!window.speechSynthesis) return;

      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);

      setTimeout(() => {
        if (synth.speaking) {
          synth.cancel();
        }

        const voicesList = voices.length ? voices : synth.getVoices();
        let selectedVoice = voicesList.find((v) => /female/i.test(v.name));
        utterance.voice = selectedVoice || voicesList[0];

        utterance.pitch = 1.1;
        utterance.rate = 1.05;

        utterance.onend = () => {
          if (callback) callback();
        };

        synth.speak(utterance);
      }, 150);
    },
    [voices]
  );

  const speak = (message) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "en-US";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voicesList = voices.length ? voices : window.speechSynthesis.getVoices();
      let selectedVoice = voicesList.find(v =>
        navigator.userAgent.includes("Mac") ? v.voiceURI === "com.apple.speech.synthesis.voice.Victoria" :
        navigator.userAgent.includes("Chrome") ? v.name.includes("Google US English Female") :
        v.voiceURI === "Microsoft Zira - English (United States)"
      );

      if (!selectedVoice) {
        selectedVoice = voicesList.find(v => v.name.toLowerCase().includes("female"));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const processSpeechInput = useCallback(
    (speech) => {
      const reportKeywords = [
        "report",
        "CG report",
        "capital gain report",
        "capital gain statement",
        "cap gain",
        "CG statement"
      ];

      const yearRegex =
        /(?:FY|fi|financial year)?[ -]?(\d{2,4})(?:[- ]?(\d{2,4}))?/i;

      const findBestMatch = (input, keywords) =>
        keywords.find((keyword) =>
          input.toLowerCase().includes(keyword.toLowerCase())
        ) || null;

      const fileName = findBestMatch(speech, reportKeywords);

      const yearMatch = speech.match(yearRegex);
      const year = yearMatch
        ? yearMatch.slice(1).filter(Boolean).join("-")
        : null;

      let clientContent = null;
      if (
        speech.toLowerCase().includes("clients") ||
        speech.toLowerCase().includes("client")
      ) {
        clientContent =
          speech.split(/clients/i)[1]?.trim() ||
          speech.split(/client/i)[1]?.trim();
      }

      let clientName = clientContent;
      clientName = clientName?.trim();

      if (clientName?.includes(".")) {
        clientName = clientName.replace(/\./g, "").trim();
      }
      clientName = clientName?.length > 0 ? clientName : null;

      console.log("fileName, year, clientName", fileName, year, clientName);

      if (fileName && year && clientName) {
        const data = { fileName, year, clientName };

        speak("Please wait, I'm validating your command");
        sendDataToAPI(data);
      } else {
        updateStatus("Invalid command. Please try again.");
        speak("Invalid command. Please try again.");
        setProcessing(false);
      }
    },
    [speak]
  );

  const userBaseUrl = `${import.meta.env.VITE_PMS}/voice`;

  async function sendDataToAPI(data) {
    try {
      const response = await axios.post(userBaseUrl, data);
      if (response.status === 200) {
        updateStatus("Data uploaded successfully and email sent!");
        speak("Email sent successfully.");
      } else {
        updateStatus("Failed to upload data. Please try again.");
        speak("Failed to upload data. Please try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while uploading data.";
      updateStatus(errorMessage);
      speak(errorMessage);
    } finally {
      setProcessing(false);
      speak("Thank you.");
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Voice Assistant</h2>
      <button
        onClick={toggleListening}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isListening ? "Stop Listening" : "Start Listening"}
      </button>
      <p className="mt-4">Transcript: {transcript}</p>
      <p className="mt-2 font-bold">Response: {response}</p>
      <p className="mt-2 font-semibold text-blue-500">{status}</p>
    </div>
  );
};

export default Speech;