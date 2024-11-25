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
agent = Agent(config=config)


@app.route("/")
def home():
    return jsonify({"message": "Server is running!!!"})


@app.route("/api/move", methods=["POST"])
def move():
    data = request.get_json()
    app.logger.info(data)
    agent_name = data["agent"]
    obs = Observation(board=data["board"], mark=data["player"])

    move = agent.agent[agent_name].getMove(obs)
    return jsonify({"move": move})

@app.route("/api/config", methods=["GET"])
def get_config():
    print("get_config called!", config.__dict__)
    return jsonify({"rows": config.rows, "cols": config.columns, "inarow": config.inarow})

@app.route("/api/config", methods=["POST"])
def update_config():
    data = request.get_json()
    global config
    global agent
    print("update_config called!", data)
    new_config = Config(rows=data["rows"], cols=data["cols"], inarow=data["inarow"])
    new_agent = Agent(config=config)
    config = new_config
    agent = new_agent
    return jsonify({"rows": data["rows"], "cols": data["cols"], "inarow": data["inarow"]})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port, debug=True)
