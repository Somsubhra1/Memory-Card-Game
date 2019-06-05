// Grabbing DOM Elements
const cards = document.querySelectorAll('.memory-card');
const restartbtn = document.querySelector('.restart-btn');
const time_span = document.querySelector('.time');
const alert_div = document.querySelector('.alert');
const time_alert = document.querySelector('.alert-time');

// Setting localStorage for first time user
if (!localStorage.getItem('memoryRecord')) {
    localStorage.setItem('memoryRecord', Number.MAX_SAFE_INTEGER.toString());
}

// Setting globals
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let count = 0;
let time = 0;
let timerVar = setInterval(timer, 1000);

// Adding eventListeners to each card
cards.forEach(card => card.addEventListener('click', flipCard));
// Adding eventListener to window for shuffling
window.addEventListener('load', shuffle);
// Adding eventListener to restart btn
restartbtn.addEventListener('click', restart);

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
        count++;
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
    if (count === 6) {
        restartbtn.style.display = 'block';
        clearInterval(timerVar);
        checkRecord();        
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
    });
}

// Game restart function
function restart() {
    cards.forEach(card => {
        card.classList.remove('flip');
    });
    restartbtn.style.display = 'none';
    cards.forEach(card => card.addEventListener('click', flipCard));
    count = 0;
    time = 0;
    shuffle();
    reset();
    timerVar = setInterval(timer, 1000);
}

// Timer function to update the time spent
function timer() {
    time++;
    time_span.textContent = time.toString().toHHMMSS();
}

// Adding custom prototype to String for time conversion
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
}

// Function to check localstorage for time records
function checkRecord() {
    if (time < parseInt(localStorage.getItem('memoryRecord'))) {
        localStorage.setItem('memoryRecord', time.toString());
        time_alert.textContent = time.toString().toHHMMSS();
        alert_div.style.display = 'block';
        setTimeout(() => {
            alert_div.style.display = 'none';            
        }, 3000);
    }
}