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

def get_random_move(obs, config):
    return random.choice(list(range(config.columns)))

def get_lookahead_move(obs, config, n=3):
    grid = np.array(obs.board).reshape(config.rows, config.columns)
    mark = obs.mark
    
    def drop_piece(grid, col, mark):
        next_grid = grid.copy()
        for row in range(config.rows-1, -1, -1):
            if next_grid[row][col] == 0:
                break
        next_grid[row][col] = mark
        return next_grid
    
    def check_window(window, num_discs, piece):
        return (window.count(piece) == num_discs and window.count(0) == config.inarow-num_discs)
    
    def count_windows(grid, num_discs, piece):
        num_windows = 0
        # horizontal
        for row in range(config.rows):
            for col in range(config.columns-(config.inarow-1)):
                window = list(grid[row, col:col+config.inarow])
                if check_window(window, num_discs, piece):
                    num_windows += 1
        # vertical
        for row in range(config.rows-(config.inarow-1)):
            for col in range(config.columns):
                window = list(grid[row:row+config.inarow, col])
                if check_window(window, num_discs, piece):
                    num_windows += 1
        # positive diagonal
        for row in range(config.rows-(config.inarow-1)):
            for col in range(config.columns-(config.inarow-1)):
                window = list(grid[range(row, row+config.inarow), range(col, col+config.inarow)])
                if check_window(window, num_discs, piece):
                    num_windows += 1
        # negative diagonal
        for row in range(config.inarow-1, config.rows):
            for col in range(config.columns-(config.inarow-1)):
                window = list(grid[range(row, row-config.inarow, -1), range(col, col+config.inarow)])
                if check_window(window, num_discs, piece):
                    num_windows += 1
        return num_windows
    
    def get_heuristic(grid, mark):
        num_threes = count_windows(grid, 3, mark)
        num_fours = count_windows(grid, 4, mark)
        num_threes_opp = count_windows(grid, 3, mark%2+1)
        num_fours_opp = count_windows(grid, 4, mark%2+1)
        score = num_threes - 1e2*num_threes_opp - 1e4*num_fours_opp + 1e6*num_fours
        return score
    
    def is_terminal_window(window):
        return window.count(1) == config.inarow or window.count(2) == config.inarow
    
    def is_terminal_node(grid):
        # Check for draw 
        if list(grid[0, :]).count(0) == 0:
            return True
        # Check for win: horizontal, vertical, or diagonal
        # horizontal 
        for row in range(config.rows):
            for col in range(config.columns-(config.inarow-1)):
                window = list(grid[row, col:col+config.inarow])
                if is_terminal_window(window):
                    return True
        # vertical
        for row in range(config.rows-(config.inarow-1)):
            for col in range(config.columns):
                window = list(grid[row:row+config.inarow, col])
                if is_terminal_window(window):
                    return True
        # positive diagonal
        for row in range(config.rows-(config.inarow-1)):
            for col in range(config.columns-(config.inarow-1)):
                window = list(grid[range(row, row+config.inarow), range(col, col+config.inarow)])
                if is_terminal_window(window):
                    return True
        # negative diagonal
        for row in range(config.inarow-1, config.rows):
            for col in range(config.columns-(config.inarow-1)):
                window = list(grid[range(row, row-config.inarow, -1), range(col, col+config.inarow)])
                if is_terminal_window(window):
                    return True
        return False
    
    def minimax(node, depth, maximizingPlayer, mark):
        is_terminal = is_terminal_node(node)
        valid_moves = [c for c in range(config.columns) if node[0][c] == 0]
        if depth == 0 or is_terminal:
            return get_heuristic(node, mark)
        if maximizingPlayer:
            value = float('-inf')
            for col in valid_moves:
                child = drop_piece(node, col, mark)
                value = max(value, minimax(child, depth-1, False, mark))
            return value
        else:
            value = float('inf')
            for col in valid_moves:
                child = drop_piece(node, col, mark%2+1)
                value = min(value, minimax(child, depth-1, True, mark))
            return value
    
    def score_move(grid, col, mark, nsteps):
        next_grid = drop_piece(grid, col, mark)
        score = minimax(next_grid, nsteps-1, False, mark)
        return score
    
    # Main logic
    valid_moves = [c for c in range(config.columns) if grid[0][c] == 0]
    scores = dict(zip(valid_moves, [score_move(grid, col, mark, n) for col in valid_moves]))
    max_cols = [key for key in scores.keys() if scores[key] == max(scores.values())]
    return random.choice(max_cols)