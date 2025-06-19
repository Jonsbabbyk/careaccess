import React, { useState } from 'react';

const TTSAssistant = () => {
  const [text, setText] = useState('');

  const handleSpeak = async () => {
    const response = await fetch("http://localhost:5000/api/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } else {
      alert("Failed to speak. Check your backend or API key.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <textarea
        className="w-full border p-2 rounded"
        rows={4}
        placeholder="Type your health question here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleSpeak}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Ask Doctor (Voice)
      </button>
    </div>
  );
};

export default TTSAssistant;
