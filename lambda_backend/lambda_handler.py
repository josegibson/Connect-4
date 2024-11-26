import json


def lambda_handler(event, context):
    
    # Extract route and HTTP method
    route = event["requestContext"]["http"]["path"]  # For HTTP API
    method = event["requestContext"]["http"]["method"]

    message = sample()

    # Define logic based on route and method
    if route == "/" and method == "GET":
        return {
            "statusCode" : 200,
            "body" : message
        }

    if route == "/users" and method == "GET":
        return {
            "statusCode": 200,
            "body": "Fetching users list"
        }
    elif route == "/orders" and method == "GET":
        return {
            "statusCode": 200,
            "body": "Fetching orders list"
        }
    elif route == "/products" and method == "GET":
        return {
            "statusCode": 200,
            "body": "Fetching products list"
        }
    else:
        return {
            "statusCode": 404,
            "body": "Route not found"
        }
    

import random
import numpy as np

class Config:
    def __init__(self, rows, cols, inarow):
        self.rows = rows
        self.columns = cols
        self.inarow = inarow

class Observation:
    def __init__(self, board, mark):
        self.board = board
        self.mark = mark

class Agent:
    def __init__(self, config = Config(rows=6, cols=7, inarow=4)):
        self.config = config
        self.agent = {}

        self.agent['lookahead'] = LookaheadAgent(config, n=2)
        self.agent['random'] = RandomAgent(config)

    def getMove(self, obs, agent_type):
        return self.agent[agent_type].getMove(obs)
    
class RandomAgent:
    def __init__(self, config):
        self.config = config

    def getMove(self, obs):
        return random.choice(list(range(self.config.columns)))
    
class LookaheadAgent:

    def __init__(self, config, n=None):
        self.config = config
        self.N_STEPS = n if n is not None else config.inarow  # Use inarow as default depth

    # How deep to make the game tree: higher values take longer to run!
    def getMove(self, obs):
        # Get list of valid moves
        grid = np.array(obs.board).reshape(self.config.rows, self.config.columns)
        mark = obs.mark

        valid_moves = [c for c in range(self.config.columns) if grid[0][c] == 0]

        # Use the heuristic to assign a score to each possible board in the next step
        scores = dict(zip(valid_moves, [self.score_move(grid, col, mark, self.N_STEPS) for col in valid_moves]))
        # Get a list of columns (moves) that maximize the heuristic
        max_cols = [key for key in scores.keys() if scores[key] == max(scores.values())]
        # Select at random from the maximizing columns
        return random.choice(max_cols)

    # Helper function for minimax: calculates value of heuristic for grid
    def get_heuristic(self, grid, mark):
        num_threes = self.count_windows(grid, self.config.inarow - 1, mark)
        num_fours = self.count_windows(grid, self.config.inarow, mark)
        num_threes_opp = self.count_windows(grid, self.config.inarow - 1, mark % 2 + 1)
        num_fours_opp = self.count_windows(grid, self.config.inarow, mark % 2 + 1)
        score = num_threes - 1e2 * num_threes_opp - 1e4 * num_fours_opp + 1e6 * num_fours
        return score

    # Uses minimax to calculate value of dropping piece in selected column
    def score_move(self, grid, col, mark, nsteps):
        next_grid = self.drop_piece(grid, col, mark)
        score = self.minimax(next_grid, nsteps-1, False, mark)
        return score

    # Helper function for minimax: checks if agent or opponent has four in a row in the window
    def is_terminal_window(self, window):
        return window.count(1) == self.config.inarow or window.count(2) == self.config.inarow

    # Helper function for minimax: checks if game has ended
    def is_terminal_node(self, grid):
        # Check for draw 
        if list(grid[0, :]).count(0) == 0:
            return True
        # Check for win: horizontal, vertical, or diagonal
        # horizontal 
        for row in range(self.config.rows):
            for col in range(self.config.columns-(self.config.inarow-1)):
                window = list(grid[row, col:col+self.config.inarow])
                if self.is_terminal_window(window):
                    return True
        # vertical
        for row in range(self.config.rows-(self.config.inarow-1)):
            for col in range(self.config.columns):
                window = list(grid[row:row+self.config.inarow, col])
                if self.is_terminal_window(window):
                    return True
        # positive diagonal
        for row in range(self.config.rows-(self.config.inarow-1)):
            for col in range(self.config.columns-(self.config.inarow-1)):
                window = list(grid[range(row, row+self.config.inarow), range(col, col+self.config.inarow)])
                if self.is_terminal_window(window):
                    return True
        # negative diagonal
        for row in range(self.config.inarow-1, self.config.rows):
            for col in range(self.config.columns-(self.config.inarow-1)):
                window = list(grid[range(row, row-self.config.inarow, -1), range(col, col+self.config.inarow)])
                if self.is_terminal_window(window):
                    return True
        return False

    # Minimax implementation
    def minimax(self, node, depth, maximizingPlayer, mark):
        is_terminal = self.is_terminal_node(node)
        valid_moves = [c for c in range(self.config.columns) if node[0][c] == 0]
        if depth == 0 or is_terminal:
            return self.get_heuristic(node, mark)
        if maximizingPlayer:
            value = float('-inf')
            for col in valid_moves:
                child = self.drop_piece(node, col, mark)
                value = max(value, self.minimax(child, depth-1, False, mark))
            return value
        else:
            value = float('inf')
            for col in valid_moves:
                child = self.drop_piece(node, col, mark%2+1)
                value = min(value, self.minimax(child, depth-1, True, mark))
            return value
        

    # Helper function for score_move: gets board at next step if agent drops piece in selected column
    def drop_piece(self, grid, col, mark):
        next_grid = grid.copy()
        for row in range(self.config.rows-1, -1, -1):
            if next_grid[row][col] == 0:
                break
        next_grid[row][col] = mark
        return next_grid
    
    # Helper function for get_heuristic: checks if window satisfies heuristic conditions
    def check_window(self, window, num_discs, piece):
        return (window.count(piece) == num_discs and window.count(0) == self.config.inarow-num_discs)
    
    # Helper function for get_heuristic: counts number of windows satisfying specified heuristic conditions
    def count_windows(self, grid, num_discs, piece):
        num_windows = 0
        # horizontal
        for row in range(self.config.rows):
            for col in range(self.config.columns-(self.config.inarow-1)):
                window = list(grid[row, col:col+self.config.inarow])
                if self.check_window(window, num_discs, piece):
                    num_windows += 1
        # vertical
        for row in range(self.config.rows-(self.config.inarow-1)):
            for col in range(self.config.columns):
                window = list(grid[row:row+self.config.inarow, col])
                if self.check_window(window, num_discs, piece):
                    num_windows += 1
        # positive diagonal
        for row in range(self.config.rows-(self.config.inarow-1)):
            for col in range(self.config.columns-(self.config.inarow-1)):
                window = list(grid[range(row, row+self.config.inarow), range(col, col+self.config.inarow)])
                if self.check_window(window, num_discs, piece):
                    num_windows += 1
        # negative diagonal
        for row in range(self.config.inarow-1, self.config.rows):
            for col in range(self.config.columns-(self.config.inarow-1)):
                window = list(grid[range(row, row-self.config.inarow, -1), range(col, col+self.config.inarow)])
                if self.check_window(window, num_discs, piece):
                    num_windows += 1
        return num_windows


config = Config(rows=6, cols=7, inarow=4)
agent = Agent(config=config)

def home():
    return "Server is running!!!"

def move():
    data = request.get_json()
    app.logger.info(data)
    agent_name = data["agent"]
    obs = Observation(board=data["board"], mark=data["player"])

    move = agent.agent[agent_name].getMove(obs)
    return jsonify({"move": move})

def get_config():
    print("get_config called!", config.__dict__)
    return jsonify({"rows": config.rows, "cols": config.columns, "inarow": config.inarow})

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

