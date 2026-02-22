window.initTicTacToe = function (container) {
  container.innerHTML = `
    <style>
      .board {
        display: grid;
        grid-template-columns: repeat(3, 100px);
        grid-template-rows: repeat(3, 100px);
        gap: 10px;
        margin-bottom: 20px;
      }
      .cell {
        background: rgba(255,255,255,0.1);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        cursor: pointer;
        transition: 0.2s;
        border: 1px solid rgba(255,255,255,0.2);
        color: white;
      }
      .cell:hover {
        background: rgba(255,255,255,0.2);
      }
      .cell.taken {
        cursor: not-allowed;
      }
    </style>
    <div class="game-message" id="ttt-msg">Giliran: X</div>
    <div class="board" id="ttt-board">
      ${Array(9).fill('').map((_, i) => `<div class="cell" data-index="${i}"></div>`).join('')}
    </div>
    <button class="btn-primary" id="ttt-reset">Reset Game</button>
  `;

  const cells = container.querySelectorAll('.cell');
  const msg = container.querySelector('#ttt-msg');
  const btnReset = container.querySelector('#ttt-reset');

  let state = Array(9).fill(null);
  let xIsNext = true;
  let isGameOver = false;

  function checkWinner() {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (state[a] && state[a] === state[b] && state[a] === state[c]) {
        return state[a];
      }
    }
    if (!state.includes(null)) return 'Draw';
    return null;
  }

  function handleClick(e) {
    if (isGameOver) return;
    const index = e.target.getAttribute('data-index');
    if (!index || state[index]) return;

    state[index] = xIsNext ? 'X' : 'O';
    e.target.textContent = state[index];
    e.target.classList.add('taken');

    if (state[index] === 'X') e.target.style.color = '#60a5fa';
    else e.target.style.color = '#f43f5e';

    const winner = checkWinner();
    if (winner) {
      isGameOver = true;
      if (winner === 'Draw') {
        msg.textContent = 'Seri!';
      } else {
        msg.textContent = `Pemenang: ${winner}! 🎉`;
      }
    } else {
      xIsNext = !xIsNext;
      msg.textContent = `Giliran: ${xIsNext ? 'X' : 'O'}`;
    }
  }

  function resetGame() {
    state.fill(null);
    xIsNext = true;
    isGameOver = false;
    msg.textContent = 'Giliran: X';
    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('taken');
      cell.style.color = 'white';
    });
  }

  cells.forEach(c => c.addEventListener('click', handleClick));
  btnReset.addEventListener('click', resetGame);
}

window.destroyTicTacToe = function () { };
