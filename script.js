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
        updateStatus(`${activePlayer.name}'s turn`);

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

  const getBestMove = (board, player) => {
    let bestScore = player === players[0].token ? -Infinity : Infinity; // If the player is 0, then the are the maximizer and their score is set to - inf, with the goal to maximize their score
    let bestMove;

    const availableMoves = game.getAvailableMoves();

    for (let move of availableMoves) {
      board[move.row][move.col] = player;

      // Now We call minimax algorithm
      let score = minimax(board, 0, player === players[0].token);
      board[move.row][move.col] = " ";

      if (player === players[0].token) {
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      } else {
        if (score < bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }

      return bestMove;
    }
  };

  const aiMove = () => {
    const bestMove = getBestMove(game.getBoard(), activePlayer.token);
    if (bestMove) {
      handleCellClick(bestMove.row, bestMove.col);
    }
  };

  const scores = {
    [players[0].token]: 1,
    [players[1].token]: -1,
    Draw: 0,
  };

  const minimax = (board, depth, isMaximizing) => {
    let result = game.checkWinner();
    if (result !== "No Winner Yet") {
      return scores[result.split(" ")[0]] || scores.Draw;
      //this is checking terminal state
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === " ") {
            board[i][j] = players[0].token;
            let score = minimax(board, depth + 1, false); // the next move is minimizing
            board[i][j] = " ";
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === " ") {
            board[i][j] = players[1].token;
            let score = minimax(board, depth + 1, true);
            board[i][j] = " ";
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  };

  const init = () => {
    renderBoard();
    updateStatus(`${activePlayer.name}'s turn`);
  };

  return { init, refreshBoard };
}
document.addEventListener("DOMContentLoaded", () => {
  const startGame = Game_Controller("Player ", "AI");
  startGame.init();

  const refreshButton = document.getElementById("refreshButton");
  refreshButton.addEventListener("click", () => {
    startGame.refreshBoard();
  });
});

// Generate Random AI Move
/*     const availableMoves = game.getAvailableMoves();
    if (availableMoves.length > 0) {
      const randomMove =
        availableMoves[Math.floor(Math.random() * availableMoves.length)];
      handleCellClick(randomMove.row, randomMove.col); //
    } */
