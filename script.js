// Greek alphabet letters for the cards (12 unique letters for 12 pairs)
const greekLetters = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ'];

// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let score = 100;
let isProcessing = false;
let gameEnded = false;

// DOM elements
const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const gameStatus = document.getElementById('gameStatus');
const resetBtn = document.getElementById('resetBtn');

// Initialize the game
function initGame() {
    // Reset game state
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    score = 100;
    isProcessing = false;
    gameEnded = false;
    
    // Create pairs of cards
    const cardPairs = [...greekLetters, ...greekLetters];
    
    // Shuffle cards using Fisher-Yates algorithm
    cards = shuffleArray(cardPairs);
    
    // Update UI
    updateScore();
    updateStatus('Click cards to find matching pairs!');
    gameStatus.classList.remove('win', 'lose');
    
    // Render cards
    renderCards();
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Render cards to the DOM
function renderCards() {
    gameBoard.innerHTML = '';
    
    cards.forEach((letter, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.dataset.letter = letter;
        
        card.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front">${letter}</div>
        `;
        
        card.addEventListener('click', handleCardClick);
        gameBoard.appendChild(card);
    });
}

// Handle card click
function handleCardClick(e) {
    if (gameEnded || isProcessing) return;
    
    const card = e.currentTarget;
    
    // Prevent clicking already flipped or matched cards
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // Flip the card
    card.classList.add('flipped');
    flippedCards.push(card);
    
    // Check if two cards are flipped
    if (flippedCards.length === 2) {
        isProcessing = true;
        checkMatch();
    }
}

// Check if flipped cards match
function checkMatch() {
    const [card1, card2] = flippedCards;
    const letter1 = card1.dataset.letter;
    const letter2 = card2.dataset.letter;
    
    if (letter1 === letter2) {
        // Match found!
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            
            flippedCards = [];
            isProcessing = false;
            
            // Check win condition
            if (matchedPairs === greekLetters.length) {
                endGame(true);
            } else {
                updateStatus(`Great match! ${greekLetters.length - matchedPairs} pairs remaining.`);
            }
        }, 600);
    } else {
        // No match - deduct points
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            
            flippedCards = [];
            isProcessing = false;
            
            // Deduct 4 points for wrong match
            score -= 4;
            updateScore();
            
            // Check lose condition
            if (score <= 0) {
                score = 0;
                updateScore();
                endGame(false);
            } else {
                updateStatus(`Not a match! -4 points. Keep trying!`);
            }
        }, 1000);
    }
}

// Update score display
function updateScore() {
    scoreDisplay.textContent = score;
    
    // Add visual feedback for score changes
    scoreDisplay.style.transform = 'scale(1.2)';
    setTimeout(() => {
        scoreDisplay.style.transform = 'scale(1)';
    }, 200);
}

// Update game status message
function updateStatus(message) {
    gameStatus.textContent = message;
}

// End game (win or lose)
function endGame(won) {
    gameEnded = true;
    
    // Disable all cards
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.classList.add('disabled'));
    
    if (won) {
        updateStatus(`🎉 Congratulations! You won with ${score} points! 🎉`);
        gameStatus.classList.add('win');
    } else {
        updateStatus(`💔 Game Over! You ran out of points. Try again! 💔`);
        gameStatus.classList.add('lose');
    }
}

// Reset game
resetBtn.addEventListener('click', () => {
    initGame();
});

// Start the game when page loads
initGame();
