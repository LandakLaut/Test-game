// Menggunakan object di window scope (non-module) supaya bisa jalan tanpa Live Server

const lobbyScreen = document.getElementById('lobby');
const gameScreen = document.getElementById('game-container');
const gameCards = document.querySelectorAll('.game-card');
const btnBack = document.getElementById('btn-back');
const gameTitle = document.getElementById('game-title');
const gameContent = document.getElementById('game-content');

let currentGame = null;

const GAMES = {
    tictactoe: {
        title: 'Tic-Tac-Toe',
        init: window.initTicTacToe,
        destroy: window.destroyTicTacToe
    },
    rps: {
        title: 'Batu Gunting Kertas',
        init: window.initRPS,
        destroy: window.destroyRPS
    },
    snake: {
        title: 'Snake',
        init: window.initSnake,
        destroy: window.destroySnake
    },
    flappy: {
        title: 'Flappy Bird',
        init: window.initFlappy,
        destroy: window.destroyFlappy
    }
};

gameCards.forEach(card => {
    card.addEventListener('click', () => {
        const gameId = card.getAttribute('data-game');
        openGame(gameId);
    });
});

btnBack.addEventListener('click', returnToLobby);

function openGame(gameId) {
    const game = GAMES[gameId];
    if (!game) return;

    currentGame = gameId;

    gameTitle.textContent = game.title;
    lobbyScreen.classList.remove('active');
    lobbyScreen.classList.add('hidden');

    gameScreen.classList.remove('hidden');
    gameScreen.classList.add('active');

    gameContent.innerHTML = '';
    game.init(gameContent);
}

function returnToLobby() {
    if (currentGame && GAMES[currentGame].destroy) {
        GAMES[currentGame].destroy();
    }

    currentGame = null;

    gameScreen.classList.remove('active');
    gameScreen.classList.add('hidden');

    lobbyScreen.classList.remove('hidden');
    lobbyScreen.classList.add('active');
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW terdaftar!', reg.scope))
            .catch(err => console.error('SW gagal terdaftar', err));
    });
}
