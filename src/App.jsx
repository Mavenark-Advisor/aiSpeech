import React from 'react'
import SpeechToText from './SpeechToText';
// import Speech from './Speech'

const App = () => {
  return (
    <div>
      {/* <Speech/> */}
      <SpeechToText/>
    </div>
  )
}

export default App

// import React, { useState } from "react";

// function App() {
//   const [text, setText] = useState("");

//   const handleSpeech = () => {
//     const msg = new SpeechSynthesisUtterance();
//     msg.text = text;
//     window.speechSynthesis.speak(msg);
//   };

//   return (
//     <div className="App">
//       <h1>React Text-to-Speech App</h1>
//       <input
//         type="text"
//         value={text}
//         placeholder="Enter text"
//         onChange={(e) => setText(e.target.value)}
//       />
//       <button onClick={handleSpeech}>Speak</button>
//     </div>
//   );
// }

// export default App;
