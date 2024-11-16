from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

port = int(os.getenv("PORT", 5000))

@app.route("/")
def home():
    return jsonify({"message": "Server is running!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port)
