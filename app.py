from flask import Flask, request, send_file
import requests
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'audio'

ELEVEN_API_KEY = "sk_f84aa1405cec9bb9c83aa02430a33bc5f67c84881d0c4ea6"  # Replace with your API key
VOICE_ID = "EXAVITQu4vr4xnSDxMaL"  # Rachel (default)

@app.route("/api/speak", methods=["POST"])
def speak():
    text = request.json.get("text")
    if not text:
        return {"error": "No text provided"}, 400

    headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "text": text,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }

    tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

    response = requests.post(tts_url, headers=headers, json=payload)

    if response.status_code == 200:
        audio_path = os.path.join(app.config['UPLOAD_FOLDER'], "speech.mp3")
        with open(audio_path, "wb") as f:
            f.write(response.content)
        return send_file(audio_path, mimetype="audio/mpeg")
    else:
        return {"error": "TTS failed", "status": response.status_code}, 500

if __name__ == "__main__":
    os.makedirs("audio", exist_ok=True)
    app.run(debug=True)
