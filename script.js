function Game_Board() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  return { getBoard };
}

function Cell() {
  let value = "";
  return { value };
}

function createPlayer(name) {
  return { name };
}

function Game_Controller() {
  createPlayer(PlayerOne, PlayerTwo);
}

const game = Game_Board();
console.log(game.getBoard());

// Import prompt-sync
const prompt = require("prompt-sync")({ sigint: true });

let firstName = prompt("Please enter your name: ");
console.log("Hello, " + firstName + "!");

const age = prompt("How old are you? ");
console.log(`You are ${age} years old.`);
