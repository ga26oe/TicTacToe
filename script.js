function Game_Board() {
  let board = createEmptyBoard();

  function createEmptyBoard() {
    return [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ];
  }
  const getBoard = () => board.map((row) => [...row]); //returning a deep copy

  const updateBoard = (row, col, token) => {
    if (row >= 0 && row < 3 && col >= 0 && col < 3 && board[row][col] === " ") {
      board[row][col] = token;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = createEmptyBoard();
  };

  const getAvailableMoves = () => {
    let moves = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === " ") {
          moves.push({ row: i, col: j });
        }
      }
    }
    return moves;
  };

  // Uses a magic square algorithm to check if there are three tokens in a row
  function checkWinner() {
    const magicSquareBoard = [
      [8, 1, 6],
      [3, 5, 7],
      [4, 9, 2],
    ];

    const currentBoard = getBoard();

    let xValues = [];
    let oValues = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentBoard[i][j] === "X") {
          xValues.push(magicSquareBoard[i][j]);
        } else if (currentBoard[i][j] === "O") {
          oValues.push(magicSquareBoard[i][j]);
        }
      }
    }

    const checkSum = (values) => {
      if (values.length < 3) return false;

      for (let a = 0; a < values.length; a++) {
        for (let b = a + 1; b < values.length; b++) {
          for (let c = b + 1; c < values.length; c++) {
            if (values[a] + values[b] + values[c] === 15) {
              return true;
            }
          }
        }
      }
    };

    if (checkSum(xValues)) {
      return "X Wins";
    } else if (checkSum(oValues)) {
      return "O Wins";
    } else if (xValues.length + oValues.length === 9) {
      return "Draw";
    } else {
      return "No Winner Yet";
    }
  }

  return { getBoard, updateBoard, getAvailableMoves, resetBoard, checkWinner };
}

function Game_Controller(playerOneName = "Player One", playerTwoName = "AI") {
  const players = [
    {
      name: playerOneName,
      token: "X",
    },
    {
      name: playerTwoName,
      token: "O",
    },
  ];

  const game = Game_Board();
  const boardElement = document.getElementById("board");
  const statusElement = document.getElementById("status");

  const updateStatus = (message) => {
    statusElement.textContent = message;
  };

  const renderBoard = () => {
    boardElement.innerHTML = "";
    const board = game.getBoard();
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.textContent = cell;
        cellElement.addEventListener("click", () =>
          handleCellClick(rowIndex, colIndex)
        );
        boardElement.appendChild(cellElement);
      });
    });
  };

  const disableBoard = () => {
    const cells = boardElement.getElementsByClassName("cell");
    for (let cell of cells) {
      cell.style.pointerEvents = "none";
    }
  };

  const handleCellClick = (row, col) => {
    if (game.updateBoard(row, col, activePlayer.token)) {
      renderBoard();
      const result = game.checkWinner();
      if (result === "No Winner Yet") {
        switchPlayerTurn();
        updateStatus(`${activePlayer}'s turn`);

        if (activePlayer.name === "AI") {
          setTimeout(aiMove, 500);
        }
      } else {
        updateStatus(
          result === "Draw"
            ? "It's a Draw"
            : `${result}! ${activePlayer.name} is the winner!`
        );
        disableBoard();
      }
    }
  };

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const refreshBoard = () => {
    game.resetBoard();
    activePlayer = players[0];
    renderBoard();
    updateStatus(`${activePlayer.name}'s turn`);
  };

  const aiMove = () => {
    const availableMoves = getAvailableMoves();
    if (availableMoves.length > 0) {
      const randomMove =
        availableMoves[Math.floor(Math.random() * availableMoves.length)];
      handleCellClick(randomMove.row, randomMove.col); // ?
    }
  };

  const getBestMove = (board, player) => {
    let bestScore = player === "0" ? -Infinity : Infinity; // If the player is 0, then the are the maximizer and their score is set to - inf, with the goal to maximize their score
    let bestMove;

    const availableMoves = game.getAvailableMoves();

    for (let move of availableMoves) {
      board[move.row][move.col] = player;
      let score = minimax(board, 0, false);
      board[move.row][move.col] = " ";
      if (player === "0") {
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        } else {
          // For the minimizing Player
          if (score < bestScore) {
            bestScore = score;
            bestMove = move;
          }
        }
      }
    }
  };

  const minimax = (board, depth, isMaximizing) => {
    return 1;
  };

  const init = () => {
    renderBoard();
    updateStatus(`${activePlayer.name}'s turn`);
  };

  return { init, refreshBoard };
}
document.addEventListener("DOMContentLoaded", () => {
  const startGame = Game_Controller("Player 1", "AI");
  startGame.init();

  const refreshButton = document.getElementById("refreshButton");
  refreshButton.addEventListener("click", () => {
    startGame.refreshBoard();
  });
});
