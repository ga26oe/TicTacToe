const prompt = require("prompt-sync")();

function Game_Board() {
  const board = [
    [" ", " ", " "],
    [" ", " ", " "],
    [" ", " ", " "],
  ];

  const getBoard = () => board;

  const updateBoard = (row, col, token) => {
    if (row >= 0 && row < 3 && col >= 0 && col < 3 && board[row][col] === " ") {
      board[row][col] = token;
      return true;
    }
    return false;
  };

  const displayBoard = () => {
    console.log("\n 0 1 2");
    for (let i = 0; i < 3; i++) {
      console.log(`${i} ${board[i].join("|")}`);
      if (i < 2) console.log("  -+-+-");
    }
    console.log();
  };

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
    } else {
      return "No Winner Yet";
    }
  }

  return { getBoard, updateBoard, checkWinner, displayBoard };
}

function Game_Controller(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
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
      board.forEach((col, colIndex) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.addEventListener("click,", () =>
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
    if (game.updateBoard(row, col, token)) {
      renderBoard();
      const result = game.checkWinner();
      if (result === "No Winner Yet") {
        switchPlayerTurn();
        updateStatus(`${activePlayer}'s turn`);
      } else {
        updateStatus(result);
        disableBoard();
      }
    }
  };

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

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    game.displayBoard();
    console.log(
      `${getActivePlayer().name}'s turn (${
        getActivePlayer().token
      }). Enter your move (row and column).`
    );
  };

  const makeMove = () => {
    while (true) {
      const input = prompt("Enter your move (row,column) ").split(",");
      const row = parseInt(input[0], 10);
      const column = parseInt(input[1], 10);

      if (!isNaN(row) && !isNaN(column)) {
        if (game.updateBoard(row, column, getActivePlayer().token)) {
          return;
        } else {
          console.log("Invalid Move, Try Again.");
        }
      }
    }
  };

  const playGame = () => {
    let gameOver = false;
    while (!gameOver) {
      printNewRound();
      makeMove();
      const result = game.checkWinner();
      if (result !== "No Winner Yet") {
        game.displayBoard();
        console.log(result);
        gameOver = true;
      } else if (!game.getBoard().flat().includes(" ")) {
        game.displayBoard();
        console.log("It's a Draw");
        gameOver = true;
      } else {
        switchPlayerTurn();
      }
    }
  };

  return {
    playGame,
  };
}

const controller = Game_Controller("Alice", "Bob");
controller.playGame();
