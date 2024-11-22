from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from agents import Config, Observation, Agent


load_dotenv()

app = Flask(__name__)
CORS(app)


port = int(os.getenv("PORT", 5000))

config = Config(rows=6, cols=7, inarow=4)
agent = {
    "lookahead": Agent(agent_type="lookahead"),
    "random": Agent(agent_type="random"),
}


@app.route("/")
def home():
    return jsonify({"message": "Server is running!!!"})


@app.route("/api/move", methods=["POST"])
def move():
    data = request.get_json()
    app.logger.info(data)
    agent_name = data["agent"]
    obs = Observation(board=data["board"], mark=data["player"])
    #log
    app.logger.info(len(obs.board))

    move = agent[agent_name].getMove(obs)
    return jsonify({"move": move})

@app.route("/api/config", methods=["POST"])
def config():
    data = request.get_json()
    config = Config(rows=data["rows"], cols=data["cols"], inarow=data["inarow"])
    agent = {
        "lookahead": Agent(agent_type="lookahead", config=config),
        "random": Agent(agent_type="random", config=config),
    }
    return jsonify({"rows": data["rows"], "cols": data["cols"], "inarow": data["inarow"]})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port, debug=True)
