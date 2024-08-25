function Game_Board() {
  let board = createEmptyBoard();

  function createEmptyBoard() {
    return [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ];
  }

  const getBoard = () => board.map((row) => [...row]);

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

  function checkWinner() {
    const lines = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (
        board[a[0]][a[1]] !== " " &&
        board[a[0]][a[1]] === board[b[0]][b[1]] &&
        board[a[0]][a[1]] === board[c[0]][c[1]]
      ) {
        return board[a[0]][a[1]] + " Wins";
      }
    }

    if (getAvailableMoves().length === 0) {
      return "Draw";
    }

    return "No Winner Yet";
  }

  return { getBoard, updateBoard, getAvailableMoves, resetBoard, checkWinner };
}

function Game_Controller(playerOneName = "Player One", playerTwoName = "AI") {
  const players = [
    { name: playerOneName, token: "X" },
    { name: playerTwoName, token: "O" },
  ];

  const game = Game_Board();
  const boardElement = document.getElementById("board");
  const statusElement = document.getElementById("status");

  let activePlayer = players[0];

  const updateStatus = (message) => {
    statusElement.textContent = message;
    console.log("Status updated:", message); // Debug log
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
    console.log("Board rendered:", board); // Debug log
  };

  const disableBoard = () => {
    const cells = boardElement.getElementsByClassName("cell");
    for (let cell of cells) {
      cell.style.pointerEvents = "none";
    }
  };

  const handleCellClick = (row, col) => {
    console.log(`Cell clicked: row ${row}, col ${col}`); // Debug log
    if (game.updateBoard(row, col, activePlayer.token)) {
      renderBoard();
      const result = game.checkWinner();
      console.log("Winner check result:", result); // Debug log
      if (result === "No Winner Yet") {
        switchPlayerTurn();
        updateStatus(`${activePlayer.name}'s turn`);

        if (activePlayer.name === "AI") {
          console.log("AI's turn, triggering AI move"); // Debug log
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

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    console.log("Switched to:", activePlayer.name); // Debug log
  };

  const refreshBoard = () => {
    game.resetBoard();
    activePlayer = players[0];
    renderBoard();
    updateStatus(`${activePlayer.name}'s turn`);
  };

  const getBestMove = () => {
    let bestScore = -Infinity;
    let bestMove = null;
    const availableMoves = game.getAvailableMoves();
    console.log("Available moves:", availableMoves);

    for (let move of availableMoves) {
      const board = game.getBoard();
      board[move.row][move.col] = players[1].token; // AI's token
      const score = minimax(board, 0, false);
      board[move.row][move.col] = " "; // Undo the move
      console.log(`Move: (${move.row}, ${move.col}), Score: ${score}`);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    console.log("Best move:", bestMove, "with score:", bestScore);
    return bestMove;
  };

  const aiMove = () => {
    console.log("AI is thinking...");
    const bestMove = getBestMove();
    if (bestMove) {
      console.log("AI chose move:", bestMove);
      handleCellClick(bestMove.row, bestMove.col);
    } else {
      console.log("No valid moves for AI");
    }
  };

  const scores = {
    "O Wins": 1,
    "X Wins": -1,
    Draw: 0,
  };

  const minimax = (board, depth, isMaximizing) => {
    const result = checkWinnerForMinimax(board);

    if (result !== null) {
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === " ") {
            board[i][j] = players[1].token; // AI's token
            let score = minimax(board, depth + 1, false);
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
            board[i][j] = players[0].token; // Human's token
            let score = minimax(board, depth + 1, true);
            board[i][j] = " ";
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  };

  const checkWinnerForMinimax = (board) => {
    const lines = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (
        board[a[0]][a[1]] !== " " &&
        board[a[0]][a[1]] === board[b[0]][b[1]] &&
        board[a[0]][a[1]] === board[c[0]][c[1]]
      ) {
        return board[a[0]][a[1]] === "X" ? "X Wins" : "O Wins";
      }
    }

    if (board.every((row) => row.every((cell) => cell !== " "))) {
      return "Draw";
    }

    return null;
  };

  const init = () => {
    renderBoard();
    updateStatus(`${activePlayer.name}'s turn`);
  };

  return { init, refreshBoard };
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, starting game"); // Debug log
  const startGame = Game_Controller("Player One", "AI");
  startGame.init();

  const refreshButton = document.getElementById("refreshButton");
  refreshButton.addEventListener("click", () => {
    console.log("Refresh button clicked"); // Debug log
    startGame.refreshBoard();
  });
});
