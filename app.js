const squares = [...document.querySelectorAll('.square')];
const statusText = document.querySelector('#game-status');
const statusDot = document.querySelector('#status-dot');
const roundLabel = document.querySelector('#round-label');
const scoreX = document.querySelector('#wins-x');
const scoreO = document.querySelector('#wins-o');
const drawsScore = document.querySelector('#draws');
const scorePanelX = document.querySelector('#score-x');
const scorePanelO = document.querySelector('#score-o');

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const scores = { X: 0, O: 0, draws: 0 };
let board = Array(9).fill('');
let currentPlayer = 'X';
let round = 1;
let gameOver = false;

function playerName(mark) {
  return mark === 'X' ? 'Player One' : 'Player Two';
}

function updateTurn() {
  scorePanelX.classList.toggle('is-current', currentPlayer === 'X' && !gameOver);
  scorePanelO.classList.toggle('is-current', currentPlayer === 'O' && !gameOver);
  statusDot.classList.toggle('is-o', currentPlayer === 'O' && !gameOver);
  statusDot.classList.toggle('is-done', gameOver);
}

function resetRound() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameOver = false;

  squares.forEach((square, index) => {
    square.className = 'square';
    square.disabled = false;
    square.setAttribute('aria-label', `${['Top', 'Middle', 'Bottom'][Math.floor(index / 3)]} ${['left', 'middle', 'right'][index % 3]}, empty`);
  });

  statusText.textContent = "Player One's turn";
  roundLabel.textContent = `ROUND ${String(round).padStart(2, '0')}`;
  updateTurn();
  squares[0].focus();
}

function finishRound(winnerLine) {
  gameOver = true;
  if (winnerLine) {
    const winner = board[winnerLine[0]];
    scores[winner] += 1;
    document.querySelector(winner === 'X' ? '#wins-x' : '#wins-o').textContent = scores[winner];
    winnerLine.forEach((index) => squares[index].classList.add('is-winner'));
    statusText.textContent = `${playerName(winner)} wins the round!`;
  } else {
    scores.draws += 1;
    drawsScore.textContent = scores.draws;
    statusText.textContent = "It's a draw. Well played.";
  }

  squares.forEach((square) => { square.disabled = true; });
  updateTurn();
}

function play(index) {
  if (gameOver || board[index]) return;

  board[index] = currentPlayer;
  const square = squares[index];
  square.classList.add(currentPlayer === 'X' ? 'is-x' : 'is-o');
  square.disabled = true;
  square.setAttribute('aria-label', `${['Top', 'Middle', 'Bottom'][Math.floor(index / 3)]} ${['left', 'middle', 'right'][index % 3]}, ${playerName(currentPlayer)}`);

  const winningLine = winningLines.find((line) => line.every((cell) => board[cell] === currentPlayer));
  if (winningLine || board.every(Boolean)) {
    finishRound(winningLine);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `${playerName(currentPlayer)}'s turn`;
  updateTurn();
}

squares.forEach((square) => {
  square.addEventListener('click', () => play(Number(square.dataset.index)));
});

document.querySelector('#next-round').addEventListener('click', () => {
  round += 1;
  resetRound();
});

document.querySelector('#reset-match').addEventListener('click', () => {
  scores.X = 0;
  scores.O = 0;
  scores.draws = 0;
  scoreX.textContent = '0';
  scoreO.textContent = '0';
  drawsScore.textContent = '0';
  round = 1;
  resetRound();
});

resetRound();