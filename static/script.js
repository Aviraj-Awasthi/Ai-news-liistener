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

  input.value = "";
}