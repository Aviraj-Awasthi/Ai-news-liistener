// 🚀 SEND MESSAGE
async function sendMessage() {
  const input = document.getElementById("userInput");
  const chat = document.querySelector(".chat");

  const message = input.value.trim();
  if (message === "") return;

  // 🧑 Show user message
  const userMsg = document.createElement("div");
  userMsg.textContent = "🧑 " + message;
  userMsg.style.textAlign = "right";
  chat.appendChild(userMsg);

  // 📡 Send to Flask
  const response = await fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: message })
  });

  const data = await response.json();

  // 🤖 Show bot reply
  const botMsg = document.createElement("div");
  botMsg.innerHTML = "🤖 " + data.reply;
  botMsg.classList.add("bot-msg");
  chat.appendChild(botMsg);

  // 🔊 Speak reply (clean + paused)
  speakText(data.reply);

  input.value = "";
}


// 🎤 VOICE INPUT
function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.lang = "en-IN";
  recognition.start();

  recognition.onresult = function(event) {
    const text = event.results[0][0].transcript;

    // ✅ Put into input
    document.getElementById("userInput").value = text;

    // 🚀 Auto send
    sendMessage();
  };

  recognition.onerror = function(event) {
    console.error("Voice error:", event.error);
  };
}


// 🔊 SMART SPEECH OUTPUT
function speakText(text) {
  // 🛑 Stop previous speech
  window.speechSynthesis.cancel();

  // Remove HTML
  const cleanText = text.replace(/<[^>]*>/g, "");

  // ✅ Split properly into sentences
  const lines = cleanText.split(/(?<=\.)\s+/); 
  // splits after each full stop

  let index = 0;

  function speakNext() {
    if (index >= lines.length) return;

    const line = lines[index].trim();
    index++;

    if (line === "") {
      speakNext();
      return;
    }

    const speech = new SpeechSynthesisUtterance(line);
    speech.lang = "en-IN";
    speech.rate = 1;
    speech.pitch = 1;

    speech.onend = () => {
      setTimeout(speakNext, 500); // ⏸️ bigger pause
    };

    window.speechSynthesis.speak(speech);
  }

  speakNext();
}