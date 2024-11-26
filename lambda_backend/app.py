from flask import Flask, request, jsonify
from lambda_handler import lambda_handler
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

def create_lambda_event(route, method, body=None):
    """Create a mock Lambda event from Flask request"""
    event = {
        "requestContext": {
            "http": {
                "path": route,
                "method": method
            }
        }
    }
    if body:
        event["body"] = body
    return event

@app.route('/move', methods=['POST'])
def get_move():
    raw_data = request.get_json()
    payload = create_lambda_event("/move", "POST", raw_data)
    response = lambda_handler(payload, None)
    
    return jsonify(json.loads(response["body"])), response["statusCode"]

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
