import json
import random

class Config:
    def __init__(self, rows, cols, inarow):
        self.rows = rows
        self.columns = cols
        self.inarow = inarow

class Observation:
    def __init__(self, board, mark):
        self.board = board
        self.mark = mark

def get_random_move(obs, config):
    return random.choice(list(range(config.columns)))

def get_lookahead_move(obs, config, n=3):
    # The board is already a 1D list
    grid = obs.board
    mark = obs.mark
    
    def drop_piece(grid, col, mark):
        next_grid = grid[:]  # Shallow copy of the grid
        for row in range(config.rows-1, -1, -1):
            if next_grid[row * config.columns + col] == 0:
                next_grid[row * config.columns + col] = mark
                break
        return next_grid
    
    def check_window(window, num_discs, piece):
        return (window.count(piece) == num_discs and window.count(0) == config.inarow - num_discs)
    
    def count_windows(grid, num_discs, piece):
        num_windows = 0
        # horizontal
        for row in range(config.rows):
            for col in range(config.columns - (config.inarow - 1)):
                window = grid[row * config.columns + col : row * config.columns + col + config.inarow]
                if check_window(window, num_discs, piece):
                    num_windows += 1
        # vertical
        for col in range(config.columns):
            for row in range(config.rows - (config.inarow - 1)):
                window = [grid[(row + i) * config.columns + col] for i in range(config.inarow)]
                if check_window(window, num_discs, piece):
                    num_windows += 1
        # positive diagonal
        for row in range(config.rows - (config.inarow - 1)):
            for col in range(config.columns - (config.inarow - 1)):
                window = [grid[(row + i) * config.columns + (col + i)] for i in range(config.inarow)]
                if check_window(window, num_discs, piece):
                    num_windows += 1
        # negative diagonal
        for row in range(config.inarow - 1, config.rows):
            for col in range(config.columns - (config.inarow - 1)):
                window = [grid[(row - i) * config.columns + (col + i)] for i in range(config.inarow)]
                if check_window(window, num_discs, piece):
                    num_windows += 1
        return num_windows
    
    def get_heuristic(grid, mark):
        num_threes = count_windows(grid, config.inarow - 1, mark)
        num_fours = count_windows(grid, config.inarow, mark)
        num_threes_opp = count_windows(grid, config.inarow - 1, mark % 2 + 1)
        num_fours_opp = count_windows(grid, config.inarow, mark % 2 + 1)
        
        weight_three = 1
        weight_block_three = 1e2
        weight_block_win = 1e4
        weight_win = 1e6
        
        score = (
            weight_three * num_threes -
            weight_block_three * num_threes_opp -
            weight_block_win * num_fours_opp +
            weight_win * num_fours
        )
        return score
    
    def is_terminal_window(window):
        return window.count(1) == config.inarow or window.count(2) == config.inarow
    
    def is_terminal_node(grid):
        # Check for draw: all top cells in each column are filled
        for col in range(config.columns):
            if grid[col] == 0:
                break
        else:
            return True  # All top cells are filled, it's a draw
        
        # Check for win: horizontal, vertical, or diagonal
        # horizontal 
        for row in range(config.rows):
            for col in range(config.columns - (config.inarow - 1)):
                window = grid[row * config.columns + col : row * config.columns + col + config.inarow]
                if is_terminal_window(window):
                    return True
        # vertical
        for col in range(config.columns):
            for row in range(config.rows - (config.inarow - 1)):
                window = [grid[(row + i) * config.columns + col] for i in range(config.inarow)]
                if is_terminal_window(window):
                    return True
        # positive diagonal
        for row in range(config.rows - (config.inarow - 1)):
            for col in range(config.columns - (config.inarow - 1)):
                window = [grid[(row + i) * config.columns + (col + i)] for i in range(config.inarow)]
                if is_terminal_window(window):
                    return True
        # negative diagonal
        for row in range(config.inarow - 1, config.rows):
            for col in range(config.columns - (config.inarow - 1)):
                window = [grid[(row - i) * config.columns + (col + i)] for i in range(config.inarow)]
                if is_terminal_window(window):
                    return True
        return False
    
    def minimax(node, depth, maximizingPlayer, mark):
        is_terminal = is_terminal_node(node)
        valid_moves = [c for c in range(config.columns) if node[c] == 0]
        if depth == 0 or is_terminal:
            return get_heuristic(node, mark)
        if maximizingPlayer:
            value = float('-inf')
            for col in valid_moves:
                child = drop_piece(node, col, mark)
                value = max(value, minimax(child, depth - 1, False, mark))
            return value
        else:
            value = float('inf')
            for col in valid_moves:
                child = drop_piece(node, col, mark % 2 + 1)
                value = min(value, minimax(child, depth - 1, True, mark))
            return value
    
    def score_move(grid, col, mark, nsteps):
        next_grid = drop_piece(grid, col, mark)
        score = minimax(next_grid, nsteps - 1, False, mark)
        return score
    
    # Main logic
    valid_moves = [c for c in range(config.columns) if grid[c] == 0]
    scores = {col: score_move(grid, col, mark, n) for col in valid_moves}
    max_score = max(scores.values())
    max_cols = [key for key, value in scores.items() if value == max_score]
    return random.choice(max_cols)

def lambda_handler(event, context):
    try:
        # Parse the JSON body
        data = json.loads(event["body"])
        agent_name = data["agent"]
        config = Config(rows=data["config"]["rows"], 
                        cols=data["config"]["cols"], 
                        inarow=data["config"]["inARow"])
        # Flatten the board if it's a 2D array
        flat_board = [cell for row in data["board"] for cell in row]
        obs = Observation(board=flat_board, mark=data["player"])
        print(data["config"])
        
        # Determine which agent to use
        if agent_name == "random":
            move = get_random_move(obs, config)
        elif agent_name == "lookahead":
            move = get_lookahead_move(obs, config)
        else:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Invalid agent type"})
            }

        return {
            "statusCode": 200,
            "body": json.dumps({"move": move})
        }
    except Exception as e:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": str(e)})
        }
    

