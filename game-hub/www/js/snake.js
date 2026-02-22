window.initSnake = function (container) {
    container.innerHTML = `
    <style>
      .snake-container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      #snake-canvas {
        background: #1e293b;
        border: 2px solid #334155;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      }
      .snake-controls {
        display: grid;
        grid-template-columns: 60px 60px 60px;
        grid-template-rows: 60px 60px;
        gap: 10px;
        margin-top: 20px;
      }
      .snake-btn {
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: white;
        border-radius: 12px;
        font-size: 1.8rem;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
      }
      .snake-btn:active {
        background: rgba(255,255,255,0.3);
      }
      .btn-up { grid-column: 2; grid-row: 1; }
      .btn-left { grid-column: 1; grid-row: 2; }
      .btn-down { grid-column: 2; grid-row: 2; }
      .btn-right { grid-column: 3; grid-row: 2; }
      .snake-score {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 5px;
        display: flex;
        gap: 20px;
      }
      .high-score {
        color: #fbbf24;
      }
    </style>
    <div class="snake-container">
      <div class="snake-score">
        <span>Skor: <span id="snake-score-val">0</span></span>
        <span class="high-score">Tertinggi: <span id="snake-hi-val">0</span></span>
      </div>
      <canvas id="snake-canvas" width="300" height="300"></canvas>
      <div class="snake-controls">
        <button class="snake-btn btn-up" id="s-up">⬆️</button>
        <button class="snake-btn btn-left" id="s-left">⬅️</button>
        <button class="snake-btn btn-down" id="s-down">⬇️</button>
        <button class="snake-btn btn-right" id="s-right">➡️</button>
      </div>
    </div>
  `;

    const canvas = container.querySelector('#snake-canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = container.querySelector('#snake-score-val');
    const hiScoreEl = container.querySelector('#snake-hi-val');

    const gridSize = 15;
    const tileCount = canvas.width / gridSize;

    let snake = [{ x: 10, y: 10 }];
    let velocity = { x: 0, y: 0 };
    let food = { x: 15, y: 15 };
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameInterval = null;

    hiScoreEl.textContent = highScore;

    function placeFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                placeFood();
                break;
            }
        }
    }

    function gameLoop() {
        let head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

        // Check collision tembok
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            return gameOver();
        }

        // Check self collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) return gameOver();
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreEl.textContent = score;
            if (score > highScore) {
                highScore = score;
                hiScoreEl.textContent = highScore;
                localStorage.setItem('snakeHighScore', highScore);
            }
            placeFood();
        } else {
            if (velocity.x !== 0 || velocity.y !== 0) {
                snake.pop();
            } else {
                snake.pop();
            }
        }

        draw();
    }

    function draw() {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

        for (let [index, segment] of snake.entries()) {
            ctx.fillStyle = index === 0 ? '#4ade80' : '#22c55e';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        }
    }

    function gameOver() {
        clearInterval(gameInterval);
        alert('Game Over! Skor Anda: ' + score);
        reset();
    }

    function reset() {
        snake = [{ x: 10, y: 10 }];
        velocity = { x: 0, y: 0 };
        score = 0;
        scoreEl.textContent = score;
        placeFood();
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 150);
        draw();
    }

    function changeDirection(dx, dy) {
        if ((velocity.x === -dx && dx !== 0) || (velocity.y === -dy && dy !== 0)) return;
        velocity = { x: dx, y: dy };
    }

    function keydownHandler(e) {
        if (e.key === 'ArrowUp') changeDirection(0, -1);
        else if (e.key === 'ArrowDown') changeDirection(0, 1);
        else if (e.key === 'ArrowLeft') changeDirection(-1, 0);
        else if (e.key === 'ArrowRight') changeDirection(1, 0);
    }
    document.addEventListener('keydown', keydownHandler);

    container.querySelector('#s-up').addEventListener('click', () => changeDirection(0, -1));
    container.querySelector('#s-down').addEventListener('click', () => changeDirection(0, 1));
    container.querySelector('#s-left').addEventListener('click', () => changeDirection(-1, 0));
    container.querySelector('#s-right').addEventListener('click', () => changeDirection(1, 0));

    reset();

    // Cleanup
    container._snakeCleanup = () => {
        clearInterval(gameInterval);
        document.removeEventListener('keydown', keydownHandler);
    };
}

window.destroySnake = function () {
    const container = document.getElementById('game-content');
    if (container && container._snakeCleanup) {
        container._snakeCleanup();
    }
}
