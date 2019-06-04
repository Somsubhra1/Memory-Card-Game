//Grabbing DOM Elements
const cards = document.querySelectorAll('.memory-card');

// Setting globals
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

// Adding eventListeners to each card
cards.forEach(card => card.addEventListener('click', flipCard));
// Adding eventListener to window for shuffling
window.addEventListener('load', shuffle);

// Flipping card
function flipCard() {
    if (lockBoard || this === firstCard) {
        return;
    }
    this.classList.toggle('flip');
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;        
    } else {
        hasFlippedCard = false;
        secondCard = this;  
        matchCard(firstCard, secondCard);
    }    
}

// function to match card
function matchCard(firstCard, secondCard) {
    if (firstCard.dataset.name === secondCard.dataset.name) { // matching dataset attr
        // removing event listeners if it's a match
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        firstCard.style.cursor = 'default';
        secondCard.style.cursor = 'default';
        reset();
    }
    else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            // lockBoard = false;
            reset();
        }, 1500);        
    }
}

// Reset function
function reset() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Shuffle card function
function shuffle() {
    cards.forEach(card => {
        let random = Math.floor(Math.random() * 12);
        card.style.order = random;
    })
}