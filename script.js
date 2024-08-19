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
  return { getBoard, updateBoard, displayBoard };
}

function Game_Controller(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const game = Game_Board();

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
    while (true) {
      printNewRound();
      makeMove();
      switchPlayerTurn();
    }
  };
  return {
    playGame,
  };
}
const controller = Game_Controller("Alice", "Bob");
controller.playGame();
