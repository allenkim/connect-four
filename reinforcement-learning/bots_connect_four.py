import math
import numpy as np
import pickle as pickle
from random import random, randint, gauss
from copy import deepcopy

from constants import NONE, RED, YELLOW, DRAW

def softmax(x):
    """Compute softmax values for each sets of scores in x."""
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum()

def prepro(I):
    """ prepro 6x7 array into 126 (6*7*3) 1D float vector """
    def expand(elt):
        if elt == 0:
            return [1, 0, 0]
        elif elt == 1:
            return [0, 1, 0]
        elif elt == 2:
            return [0, 0, 1]
    flat_grid = [expand(elt) for elt in np.array(I).ravel()]
    return np.array(flat_grid).astype(np.float).ravel()


def pgMove(node, num = None):
    if num:
        model = pickle.load(open('save_'+str(num)+'.p', 'rb'))
    else:
        model = pickle.load(open('save.p', 'rb'))
    x = prepro(node.board)
    print(x.shape)
    h = np.dot(model['W1'], x)
    h[h<0] = 0 # ReLU nonlinearity
    logp = np.dot(model['W2'], h)
    aprob = softmax(logp)
    print(aprob)
    action = np.random.choice(7,1,p=aprob)[0]
    return action

def alphabetaMove(node, turn, strength):
    return alphabetaBot(node, strength, -math.inf, math.inf, turn, strength)

def heuristic(node):
    num_r_y = []
    for col in node.board:
        num_red = 0
        num_yellow = 0
        for elt in col:
            if elt == RED:
                num_red += 1
            elif elt == YELLOW:
                num_yellow += 1
        num_r_y.append(num_red - num_yellow)
    num_r_y[3] *= gauss(0.3,1)
    num_r_y[2] *= gauss(0.2,1)
    num_r_y[4] *= gauss(0.2,1)
    num_r_y[1] *= gauss(0.1,1)
    num_r_y[5] *= gauss(0.1,1)
    num_r_y[0] *= gauss(0,1)
    num_r_y[6] *= gauss(0,1)
    return sum(num_r_y)

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
            return 10000 + depth
        elif winner == YELLOW:
            return -10000 - depth
        else:
            return heuristic(node)
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
