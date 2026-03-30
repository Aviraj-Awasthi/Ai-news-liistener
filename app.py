from flask import Flask, render_template, request, jsonify
import requests
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv("NEWS_API_KEY")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "").lower()

    try:
        url = f"https://newsapi.org/v2/everything?q=india&apiKey={API_KEY}"
        response = requests.get(url)
        data = response.json()

        articles = data.get("articles", [])

        if not articles:
            return jsonify({"reply": "No news found brotha 😅"})

        # ✅ Create list properly
        headlines_html = ""
        for article in articles[:5]:
            headlines_html += f"<li> {article['title']}.</li>"

        # ✅ Final reply
        reply = f" Here are top headlines:<br><ul>{headlines_html}</ul>"

    except Exception as e:
        reply = f"Error: {e}"

    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True)