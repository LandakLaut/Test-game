window.initRPS = function (container) {
  container.innerHTML = `
    <style>
      .rps-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        width: 100%;
      }
      .score-board {
        display: flex;
        justify-content: space-around;
        width: 100%;
        margin-bottom: 20px;
        font-size: 1.2rem;
        background: rgba(0,0,0,0.3);
        padding: 15px;
        border-radius: 12px;
      }
      .choices {
        display: flex;
        gap: 15px;
      }
      .choice-btn {
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: white;
        font-size: 3rem;
        border-radius: 50%;
        width: 80px;
        height: 80px;
        cursor: pointer;
        transition: 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .choice-btn:hover {
        background: rgba(255,255,255,0.2);
        transform: scale(1.1);
      }
      .battle-area {
        display: flex;
        align-items: center;
        gap: 20px;
        font-size: 4rem;
        height: 100px;
        margin-bottom: 20px;
      }
      .vs {
        font-size: 1.5rem;
        color: #94a3b8;
        font-weight: bold;
      }
    </style>
    <div class="rps-container">
      <div class="score-board">
        <div>Kamu: <span id="rps-score-p">0</span></div>
        <div>Bot: <span id="rps-score-b">0</span></div>
      </div>
      
      <div class="battle-area">
        <div id="p-choice">❓</div>
        <div class="vs">VS</div>
        <div id="b-choice">🤖</div>
      </div>

      <div class="game-message" id="rps-msg">Pilih senjatamu!</div>
      
      <div class="choices">
        <button class="choice-btn" data-choice="batu">✊</button>
        <button class="choice-btn" data-choice="kertas">✋</button>
        <button class="choice-btn" data-choice="gunting">✌️</button>
      </div>
    </div>
  `;

  const btnChoices = container.querySelectorAll('.choice-btn');
  const pChoiceEl = container.querySelector('#p-choice');
  const bChoiceEl = container.querySelector('#b-choice');
  const msgEl = container.querySelector('#rps-msg');
  const scorePEl = container.querySelector('#rps-score-p');
  const scoreBEl = container.querySelector('#rps-score-b');

  let scoreP = 0;
  let scoreB = 0;

  const icons = { batu: '✊', kertas: '✋', gunting: '✌️' };
  const getWinner = (p, b) => {
    if (p === b) return 'draw';
    if ((p === 'batu' && b === 'gunting') ||
      (p === 'kertas' && b === 'batu') ||
      (p === 'gunting' && b === 'kertas')) return 'player';
    return 'bot';
  };

  btnChoices.forEach(btn => {
    btn.addEventListener('click', () => {
      const pChoice = btn.getAttribute('data-choice');
      const choicesArr = ['batu', 'kertas', 'gunting'];
      const bChoice = choicesArr[Math.floor(Math.random() * 3)];

      pChoiceEl.textContent = '🤜';
      bChoiceEl.textContent = '🤛';
      msgEl.textContent = 'Menentukan...';

      btnChoices.forEach(b => b.disabled = true);

      setTimeout(() => {
        pChoiceEl.textContent = icons[pChoice];
        bChoiceEl.textContent = icons[bChoice];

        const winner = getWinner(pChoice, bChoice);
        if (winner === 'draw') {
          msgEl.textContent = 'Seri!';
        } else if (winner === 'player') {
          msgEl.textContent = 'Kamu Menang! 🎉';
          scoreP++;
          scorePEl.textContent = scoreP;
        } else {
          msgEl.textContent = 'Bot Menang! 🤖';
          scoreB++;
          scoreBEl.textContent = scoreB;
        }
        btnChoices.forEach(b => b.disabled = false);
      }, 500);
    });
  });
}

window.destroyRPS = function () { };
