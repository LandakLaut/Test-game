window.initFlappy = function (container) {
    container.innerHTML = `
    <style>
      .flappy-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
      }
      #flappy-canvas {
        background: #38bdf8;
        border: 2px solid #0284c7;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        cursor: pointer;
        touch-action: none;
      }
      .flappy-score-board {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 10px;
        display: flex;
        gap: 20px;
      }
      .flappy-hi {
        color: #fbbf24;
      }
      .flappy-hint {
        margin-top: 15px;
        color: #cbd5e1;
        font-size: 0.9rem;
        text-align: center;
      }
    </style>
    <div class="flappy-container">
      <div class="flappy-score-board">
        <span>Skor: <span id="f-score">0</span></span>
        <span class="flappy-hi">Tertinggi: <span id="f-hi">0</span></span>
      </div>
      <canvas id="flappy-canvas" width="300" height="400"></canvas>
      <div class="flappy-hint">Ketuk area biru / Tekan Spasi untuk terbang!</div>
    </div>
  `;

    const canvas = container.querySelector('#flappy-canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = container.querySelector('#f-score');
    const hiEl = container.querySelector('#f-hi');

    let frames = 0;
    let score = 0;
    let highScore = localStorage.getItem('flappyHighScore') || 0;
    hiEl.textContent = highScore;

    const gravity = 0.25;
    const jump = -4.5;
    let isGameOver = false;
    let gameInterval = null;

    const bird = {
        x: 50,
        y: 150,
        width: 20,
        height: 20,
        velocity: 0,
        draw() {
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            // Mata burung
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.x + 14, this.y + 6, 2, 0, Math.PI * 2);
            ctx.fill();
        },
        update() {
            this.velocity += gravity;
            this.y += this.velocity;
            if (this.y + this.height >= canvas.height || this.y < 0) {
                gameOver();
            }
        },
        flap() {
            this.velocity = jump;
        }
    };

    const pipes = {
        items: [],
        width: 40,
        gap: 120,
        dx: 2,
        draw() {
            ctx.fillStyle = '#22c55e';
            for (let i = 0; i < this.items.length; i++) {
                let p = this.items[i];
                // Pipa atas
                ctx.fillRect(p.x, 0, this.width, p.top);
                // Pipa bawah
                ctx.fillRect(p.x, p.top + this.gap, this.width, canvas.height - p.top - this.gap);
            }
        },
        update() {
            // Spawn pipa baru setiap 90 frame
            if (frames % 90 === 0) {
                let minPipeHeight = 50;
                let maxPipeHeight = canvas.height - this.gap - 50;
                let topHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1) + minPipeHeight);
                this.items.push({ x: canvas.width, top: topHeight, passed: false });
            }

            for (let i = 0; i < this.items.length; i++) {
                let p = this.items[i];
                p.x -= this.dx;

                // Collision detection
                if (
                    bird.x < p.x + this.width &&
                    bird.x + bird.width > p.x &&
                    (bird.y < p.top || bird.y + bird.height > p.top + this.gap)
                ) {
                    gameOver();
                }

                // Skor nambah jika lewatin pipa
                if (p.x + this.width < bird.x && !p.passed) {
                    score++;
                    scoreEl.textContent = score;
                    p.passed = true;
                    if (score > highScore) {
                        highScore = score;
                        hiEl.textContent = highScore;
                        localStorage.setItem('flappyHighScore', highScore);
                    }
                }

                // Hapus pipa yang keluar layar
                if (p.x + this.width < 0) {
                    this.items.shift();
                    i--;
                }
            }
        },
        reset() {
            this.items = [];
        }
    };

    function drawBg() {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Tanah
        ctx.fillStyle = '#166534';
        ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    }

    function loop() {
        if (isGameOver) return;
        drawBg();
        pipes.update();
        pipes.draw();
        bird.update();
        bird.draw();
        frames++;
        gameInterval = requestAnimationFrame(loop);
    }

    function flap(e) {
        if (e && e.type === 'keydown' && e.code !== 'Space') return;
        if (isGameOver) {
            reset();
        } else {
            bird.flap();
        }
    }

    function gameOver() {
        isGameOver = true;
        cancelAnimationFrame(gameInterval);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '24px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '16px Inter';
        ctx.fillText('Ketuk untuk main lagi', canvas.width / 2, canvas.height / 2 + 20);
    }

    function reset() {
        isGameOver = false;
        bird.y = 150;
        bird.velocity = 0;
        pipes.reset();
        score = 0;
        frames = 0;
        scoreEl.textContent = score;
        loop();
    }

    canvas.addEventListener('mousedown', flap);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); flap(); }, { passive: false });
    window.addEventListener('keydown', flap);

    reset();

    // Cleanup
    container._flappyCleanup = () => {
        cancelAnimationFrame(gameInterval);
        window.removeEventListener('keydown', flap);
    };
};

window.destroyFlappy = function () {
    const container = document.getElementById('game-content');
    if (container && container._flappyCleanup) {
        container._flappyCleanup();
    }
};
