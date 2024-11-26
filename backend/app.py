from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from agents import Config, Observation, get_move

load_dotenv()

app = Flask(__name__)
CORS(app)

port = int(os.getenv("PORT", 5000))

@app.route("/")
def home():
    return jsonify({"message": "Server is running!!!"})

@app.route("/move", methods=["POST"])
def move():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
        
    data = request.get_json()
    # print(data)
    
    try:
        agent_name = data["agent"]
        config = Config(rows=data["config"]["rows"], 
                       cols=data["config"]["cols"], 
                       inarow=data["config"]["inARow"])
        obs = Observation(board=data["board"], mark=data["player"])
        
        move = get_move(agent_name, obs, config)
        
        return jsonify({"move": move})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port)
