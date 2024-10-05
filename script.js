const cells = document.querySelectorAll('.cell');
const gameStatus = document.getElementById('gameStatus');
const resetBtn = document.getElementById('resetBtn');

let currentPlayer = 'X';
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

// Sound effects
const clickSound = new Audio('click.mp3');
const winSound = new Audio('win.mp3');
const drawSound = new Audio('draw.mp3');
const resetSound = new Audio('reset.mp3');

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Functions
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedIndex = clickedCell.getAttribute('data-index');

    if (gameState[clickedIndex] !== "" || !gameActive) {
        return;
    }

    gameState[clickedIndex] = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
    clickedCell.innerText = currentPlayer;
    clickedCell.classList.add('clicked'); // Adding an animation effect on click

    clickSound.play(); // Play click sound

    checkWinner();
    if (gameActive && currentPlayer === 'O') {
        setTimeout(aiMove, 500); // AI's turn after a delay
    }
}

function checkWinner() {
    let roundWon = false;
    let winningCombo = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }

        if (a === b && b === c) {
            roundWon = true;
            winningCombo = winCondition;
            break;
        }
    }

    if (roundWon) {
        highlightWinningCombo(winningCombo); // Highlight the winning cells
        gameStatus.innerText = `Player ${currentPlayer} wins!`;
        winSound.play(); // Play win sound
        gameActive = false;
        return;
    }

    const roundDraw = !gameState.includes("");
    if (roundDraw) {
        gameStatus.innerText = "It's a draw!";
        drawSound.play(); // Play draw sound
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatus.innerText = `Player ${currentPlayer}'s turn`;
}

function highlightWinningCombo(combo) {
    combo.forEach(index => {
        const winningCell = document.querySelector(`.cell[data-index="${index}"]`);
        winningCell.classList.add('highlight'); // Add winning highlight animation
    });
}

function aiMove() {
    let availableCells = [];
    gameState.forEach((value, index) => {
        if (value === "") {
            availableCells.push(index);
        }
    });

    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    const aiCell = document.querySelector(`.cell[data-index="${randomIndex}"]`);

    gameState[randomIndex] = 'O';
    aiCell.classList.add('o');
    aiCell.innerText = 'O';
    aiCell.classList.add('clicked'); // Adding animation for AI click

    clickSound.play(); // Play click sound
    checkWinner();
}

function resetGame() {
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    gameStatus.innerText = "Player X's turn";
    resetSound.play(); // Play reset sound

    cells.forEach(cell => {
        cell.classList.remove('x', 'o', 'highlight', 'clicked'); // Remove animations
        cell.innerText = "";
    });
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
