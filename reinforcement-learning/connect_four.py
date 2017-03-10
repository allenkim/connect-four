# Credit to https://gist.github.com/poke/6934842 for the clean win checks
from itertools import groupby, chain
from random import randint

from constants import NONE, RED, YELLOW, DRAW, CHAR_MAP
from bots_connect_four import botMove

def diagonalsPos (matrix, cols, rows):
    """Get positive diagonals, going from bottom-left to top-right."""
    for di in ([(j, i - j) for j in range(cols)] for i in range(cols + rows -1)):
        yield [matrix[i][j] for i, j in di if i >= 0 and j >= 0 and i < cols and j < rows]

def diagonalsNeg (matrix, cols, rows):
    """Get negative diagonals, going from top-left to bottom-right."""
    for di in ([(j, i - cols + j + 1) for j in range(cols)] for i in range(cols + rows - 1)):
        yield [matrix[i][j] for i, j in di if i >= 0 and j >= 0 and i < cols and j < rows]

class ConnectFourGame:
    def __init__ (self, cols = 7, rows = 6, requiredToWin = 4):
        """Create a new game."""
        self.cols = cols
        self.rows = rows
        self.win = requiredToWin
        self.board = [[NONE] * rows for _ in range(cols)]

    def legalColumns(self):
        return [c_idx for c_idx, c in enumerate(self.board) if c[0] == NONE]

    def randomMove(self, color):
        """Insert a random (legal) move"""
        legal_c = self.legalColumns()
        if len(legal_c) > 0:
            rand_idx = randint(0, len(legal_c) - 1)
            self.insert(legal_c[rand_idx], color)

    def nextAvailRow(self, col):
        """Returns the row to be placed if inserted in col, -1 if NA"""
        c = self.board[col]
        if c[0] != NONE:
            return -1
        i = self.rows - 1
        while c[i] != NONE:
            i -= 1
        return i

    def insert (self, column, color):
        """Insert the color in the given column."""
        row = self.nextAvailRow(column)
        if row == -1:
            self.randomMove(color)
            return False # Was an illegal move, so random move chosen instead

        self.board[column][row] = color
        return True # Legal move

    def checkWinner (self):
        """Get the winner on the current board."""
        legal_cols = self.legalColumns()
        if len(legal_cols) <= 0:
            return DRAW
        lines = (
            self.board, # columns
            zip(*self.board), # rows
            diagonalsPos(self.board, self.cols, self.rows), # positive diagonals
            diagonalsNeg(self.board, self.cols, self.rows) # negative diagonals
        )

        for line in chain(*lines):
            for color, group in groupby(line):
                if color != NONE and len(list(group)) >= self.win:
                    return color

        return NONE

    def printBoard (self):
        """Print the board."""
        print('  '.join(map(str, range(self.cols))))
        for y in range(self.rows):
            print('  '.join(str(CHAR_MAP[self.board[x][y]]) for x in range(self.cols)))
            print()

if __name__ == '__main__':
    g = ConnectFourGame()
    turn = RED
    playerTurn = None
    botLevel = None
    while True:
        playerTurn = input('First or second player? (1 or 2): ')
        try:
            if 1 <= int(playerTurn) <= 2:
                playerTurn = RED if 1 else YELLOW
                print()
                break
        except Exception as e:
            continue

    while True:
        botLevel = input('Bot Level (0 to 5): ')
        try:
            if 0 <= int(botLevel) <= 5:
                botLevel = int(botLevel)
                print()
                break
        except Exception as e:
            continue

    while True:
        g.printBoard()
        if turn == playerTurn:
            while True:
                col = input('{}\'s turn: '.format('Red' if turn == RED else 'Yellow'))
                try:
                    if 0 <= int(col) < g.cols:
                        col = int(col)
                        break
                except Exception as e:
                    continue

            g.insert(col, turn)
        else:
            col = botMove(g, turn, botLevel)
            g.insert(col, turn)

        winner = g.checkWinner()
        if winner != NONE:
            g.printBoard()
            if winner == turn:
                print(CHAR_MAP[turn] + " wins!")
            else:
                print("Draw!")
            break

        turn = YELLOW if turn == RED else RED
