from random import random

from connect_four import ConnectFourGame

class ConnectFourGym:
    def __init__(self):
        # 1 = RED, 2 = YELLOW, bot in training will always be 1
        self.turn = 1
        self.game = ConnectFourGame()

    def reset(self):
        self.game = ConnectFourGame()
        return self.game.board

    def render(self):
        self.game.printBoard()

    def step(self, action):
        """
        action: column number to insert
        """
        self.game.insert(action, self.turn)

        observation = self.game.board
        reward = 0
        done = False
        info = {}

        if self.game.checkWinner() == turn:
