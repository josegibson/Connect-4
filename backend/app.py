from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from agents import Config, Observation, Agent




load_dotenv()

app = Flask(__name__)
CORS(app)


port = int(os.getenv("PORT", 5000))

agent = Agent(agent_type='lookahead')

@app.route("/")
def home():
    return jsonify({"message": "Server is running!!!"})

@app.route("/api/move", methods=["POST"])
def move():
    data = request.get_json()
    obs = Observation(board=data["board"], mark=data["player"])

    move = agent.getMove(obs)
    return jsonify({"move": move})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port, debug=True)
