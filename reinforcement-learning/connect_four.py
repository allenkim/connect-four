# Credit to https://gist.github.com/poke/6934842 for the clean win checks
from itertools import groupby, chain
from random import randint

NONE = 0
RED = 1
YELLOW = 2

CHAR_MAP = ['.', 'R', 'Y']

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

        def randomMove(self, color):
            """Insert a random (legal) move"""
            legal_c = [c_idx for c_idx, c in enumerate(board) if c[0] == NONE]
            rand_idx = randint(0, len(legal_c) - 1)
            self.insert(legal_c[rand_idx], color)

        def insert (self, column, color):
            """Insert the color in the given column."""
            c = self.board[column]
            if c[0] != NONE:
                self.randomMove(color)

                i = -1
                while c[i] != NONE:
                    i -= 1
                c[i] = color

        def checkWinner (self):
            """Get the winner on the current board."""
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

                return None

        def printBoard (self):
            """Print the board."""
            print('  '.join(map(str, range(self.cols))))
            for y in range(self.rows):
                print('  '.join(str(CHAR_MAP[self.board[x][y]]) for x in range(self.cols)))
                print()

if __name__ == '__main__':
    g = ConnectFourGame()
    turn = RED
    while True:
        g.printBoard()
        row = input('{}\'s turn: '.format('Red' if turn == RED else 'Yellow'))
        g.insert(int(row), turn)
        if g.checkWinner() == turn:
            g.printBoard()
            print(CHAR_MAP[turn] + " wins!")
            break
        turn = YELLOW if turn == RED else RED
