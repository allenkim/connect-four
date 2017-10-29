from random import random, randint

from constants import NONE, RED, YELLOW, DRAW
from connect_four import ConnectFourGame
from bots_connect_four import alphabetaMove, pgMove

def invert_colors(board):
    for col in range(len(board)):
        for row in range(len(board[col])):
            if board[col][row] == RED:
                board[col][row] = YELLOW
            elif board[col][row] == YELLOW:
                board[col][row] = RED

class ConnectFourGym:
    def reset(self):
        # AI is always RED and yellow or red goes first randomly
        self.firstPlayer = RED if random() < 0.5 else YELLOW
        self.opp_level = randint(2,4) # the AI that will face the bot
        self.game = ConnectFourGame()
        if self.firstPlayer == YELLOW:
            move = alphabetaMove(self.game, YELLOW, self.opp_level)
            self.game.insert(move, YELLOW)
        return self.game.board

    def render(self):
        self.game.printBoard()

    def step(self, action):
        """
        action: column number to insert
        """
        legal = self.game.insert(action, RED)

        # RED will always refer to oneself, YELLOW - the enemy
        observation = None
        reward = 0.0
        done = False
        info = {} # debugging info

        if not legal:
            reward = -1.0
            done = True
            return (observation, reward, done, info)

        winner = self.game.checkWinner()
        if winner != NONE:
            if winner == RED:
                reward = 1.0
            else:
                reward = -1.0
            done = True
        else:
            move = alphabetaMove(self.game, YELLOW, self.opp_level)
            self.game.insert(move, YELLOW)
            winner = self.game.checkWinner()
            if winner != NONE: 
                reward = -1.0
                done = True
        
        observation = self.game.board

        return (observation, reward, done, info)
