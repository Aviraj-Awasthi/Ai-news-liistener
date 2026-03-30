speechSynthesis.onvoiceschanged = () =>
{
    speechSynthesis.getVoices();
};
// SEND MESSAGE
async function sendMessage() {
  const input = document.getElementById("userInput");
  const chat = document.querySelector(".chat");

  const message = input.value.trim();
  if (message === "") return;

// Show user message
  const userMsg = document.createElement("div");
  userMsg.textContent = "🧑 " + message;
  userMsg.style.textAlign = "right";
  chat.appendChild(userMsg);

  // Send to Flask
  const response = await fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: message })
  });

  const data = await response.json();

// Show bot reply
  const botMsg = document.createElement("div");
  botMsg.innerHTML = "🤖 " + data.reply;
  botMsg.classList.add("bot-msg");
  chat.appendChild(botMsg);

// Speak reply (clean + paused)
  speakText(data.reply);

  input.value = "";
}


// VOICE INPUT
function startListening() 
{
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.lang = "en-IN";
  recognition.start();

  recognition.onresult = function(event) {
    const text = event.results[0][0].transcript;

// Put into input
    document.getElementById("userInput").value = text;

// Auto send
    sendMessage();
  };

  recognition.onerror = function(event) {
    console.error("Voice error:", event.error);
  };
}


// SMART SPEECH OUTPUT
function speakText(text) {
// Stop any previous speech
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/<[^>]*>/g, "");
    const lines = cleanText.split(/(?<=\.)\s+/);

    let index = 0;

    function getBestFemaleVoice() {
        const voices = speechSynthesis.getVoices();

// Priority list (best sounding voices)
        return voices.find(v => v.name.includes("Google UK English Female")) ||
               voices.find(v => v.name.includes("Google US English")) ||
               voices.find(v => v.name.toLowerCase().includes("female")) ||
               voices[0]; // fallback
    }

    function speakNext() {
        if (index >= lines.length) return;

        const line = lines[index].trim();
        index++;

        if (!line) {
            speakNext();
            return;
        }

        const speech = new SpeechSynthesisUtterance(line);

        // Better voice settings
        speech.voice = getBestFemaleVoice();
        speech.lang = "en-US";   // smoother accent
        speech.rate = 0.92;      // slower = clearer
        speech.pitch = 1.25;     // more feminine tone

        speech.onend = () => {
            setTimeout(speakNext, 300); // pause between lines
        };

        window.speechSynthesis.speak(speech);
    }

    speakNext();
}
function stopSpeech() 
{
    window.speechSynthesis.cancel();
}