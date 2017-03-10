import math
from random import random, randint
from copy import deepcopy

from constants import NONE, RED, YELLOW, DRAW

def botMove(node, turn, strength):
    return alphabetaBot(node, strength, -math.inf, math.inf, turn, strength)

# RED is max, YELLOW is min
def alphabetaBot(node, depth, alpha, beta, player, botLevel):
    """
    node: ConnectFourGame object
    depth: depth of alphabeta (higher the depth, stronger the bot)
    alpha: lower bound for max
    beta: upper bound for min
    player: either RED or YELLOW
    """
    winner = node.checkWinner()
    if depth == 0 or winner != NONE:
        # Case when botLevel is 0 - imitates a randomly playing bot
        if botLevel == 0:
            legal_c = node.legalColumns()
            if len(legal_c) > 0:
                rand_idx = randint(0, len(legal_c) - 1)
                return legal_c[rand_idx]

        # Simple Heuristic evaluation
        if winner == RED:
            return 100 + depth
        elif winner == YELLOW:
            return -100 - depth
        else:
            return random()
    if player == RED:
        best_v = -math.inf
        best_col = 3
        for col in range(node.cols):
            child_node = deepcopy(node)
            legal = child_node.insert(col, RED)
            if legal:
                new_v = alphabetaBot(child_node, depth - 1, alpha, beta, YELLOW, botLevel)
                if new_v > best_v:
                    best_v = new_v
                    best_col = col
                alpha = max(alpha, best_v)
                if beta <= alpha:
                    break
        if depth == botLevel:
            return best_col
        return best_v
    elif player == YELLOW:
        best_v = math.inf
        best_col = 3
        for col in range(node.cols):
            child_node = deepcopy(node)
            legal = child_node.insert(col, YELLOW)
            if legal:
                new_v = alphabetaBot(child_node, depth - 1, alpha, beta, RED, botLevel)
                if new_v < best_v:
                    best_v = new_v
                    best_col = col
                beta = min(beta, best_v)
                if beta <= alpha:
                    break
        if depth == botLevel:
            return best_col
        return best_v
