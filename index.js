let player = {
    name: "Dima",
    chips: 5000
}
window.onload = function () {
    document.getElementById("start-game-btn").disabled = false;
};


let cards = []
let sum = 0
let hasBlackJack = false
let isAlive = false
let message = ""
let bet = 0

let dealerCards = [];
let dealerSum = 0;

let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let cardsEl = document.getElementById("cards-el")
let playerEl = document.getElementById("player-el")
let betEl = document.getElementById("bet-el")
let betInput = document.getElementById("bet-input")

playerEl.textContent = player.name + ": $" + player.chips

function calculateSum(hand) {
    let sum = 0;
    let aceCount = 0;

    for (let card of hand) {
        if (card.rank > 10) {
            sum += 10; // Face cards (J, Q, K) are worth 10
        } else if (card.rank === 1) {
            sum += 11; // Treat Ace as 11 initially
            aceCount++;
        } else {
            sum += card.rank; // Number cards are their face value
        }
    }

    // Adjust Aces from 11 to 1 if sum exceeds 21
    while (sum > 21 && aceCount > 0) {
        sum -= 10;
        aceCount--;
    }

    return sum;
}


// player functions
function resetGameState() {
    cards = [];
    sum = 0;
    hasBlackJack = false;
    isAlive = false;
    message = "";
}

function makeBet() {
    let betAmount = parseInt(betInput.value)
    
    if (betAmount > player.chips) {
        betEl.textContent = "You don't have enough chips!"
        return
    }
    
    if (betAmount <= 0 || isNaN(betAmount)) {
        betEl.textContent = "Enter a valid bet amount!"
        return
    }

    resetGameState()
    bet = betAmount
    player.chips -= bet
    playerEl.textContent = player.name + ": $" + player.chips
    betEl.textContent = "Your bet: $" + bet
    isAlive = true 
    cardsEl.textContent = "Cards: "
    sumEl.textContent = "Sum: "
}

function getRandomCard() {
    let suits = ["♠", "♥", "♦", "♣"];
    let rank = Math.floor(Math.random() * 13) + 1;
    let suit = suits[Math.floor(Math.random() * suits.length)];
    return { rank, suit }; // Return a card as an object
}

// Convert card object to string
function cardToString(card) {
    let rank;
    switch (card.rank) {
        case 1:
            rank = "A";
            break;
        case 11:
            rank = "J";
            break;
        case 12:
            rank = "Q";
            break;
        case 13:
            rank = "K";
            break;
        default:
            rank = card.rank;
    }
    return `${rank}${card.suit}`;
}


function stand() {
    if (!isAlive || cards.length === 0) {
        messageEl.textContent = "You need to start the game first!";
        return;
    }

    isAlive = false;
    dealerTurn();
}

function startGame() {
    if (bet === 0) {
        betEl.textContent = "You need to place a bet first!";
        return;
    }

    // Disable "Start Game" button
    document.getElementById("start-game-btn").disabled = true;

    resetGameState();
    isAlive = true;
    // Player's cards
    let firstCard = getRandomCard();
    let secondCard = getRandomCard();
    cards = [firstCard, secondCard];
    sum = calculateSum(cards);

    // Dealer's cards
    let dealerFirstCard = getRandomCard();
    let dealerSecondCard = getRandomCard();
    dealerCards = [dealerFirstCard, dealerSecondCard];
    dealerSum = calculateSum(dealerCards);


    renderGame();
    renderDealer();
}





function renderGame() {
    cardsEl.textContent = "Cards: ";
    for (let i = 0; i < cards.length; i++) {
        cardsEl.textContent += cardToString(cards[i]) + " ";
    }

    sumEl.textContent = "Sum: " + sum;

    if (sum === 21) {
        message = "You've got Blackjack!";
        hasBlackJack = true;
        dealerTurn();
    } else if (sum > 21) {
        message = "You're out of the game!";
        isAlive = false;
        messageEl.textContent = message;
        resetBet();
        return;
    } else {
        message = "Do you want to draw a new card?";
    }

    messageEl.textContent = message;
}

function renderDealer() {
    let dealerCardsEl = document.getElementById("dealer-cards-el");
    let dealerSumEl = document.getElementById("dealer-sum-el");

    dealerCardsEl.textContent = "Dealer's Cards: ";
    for (let i = 0; i < dealerCards.length; i++) {
        dealerCardsEl.textContent += cardToString(dealerCards[i]) + " ";
    }

    dealerSumEl.textContent = "Dealer's Sum: " + dealerSum;
}



function newCard() {
    if (!isAlive || cards.length === 0) {
        messageEl.textContent = "You need to start the game first!";
        return;
    }

    if (isAlive && !hasBlackJack) {
        let card = getRandomCard();
        cards.push(card);
        sum = calculateSum(cards);
        renderGame();
        if (sum > 21) {
            return;
        }
    }
    
    }



function resetBet() {
    bet = 0;
    betEl.textContent = "Bet is settled. Place a new bet!";
    betInput.value = "";

    // Re-enable "Start Game" button for the next round
    document.getElementById("start-game-btn").disabled = false;
}


// dealer functions 
function dealerTurn() {
    messageEl.textContent = "Dealer's turn...";
    
    // Dealer draws until their sum is at least 17
    while (dealerSum < 17) {
        let card = getRandomCard();
        dealerCards.push(card);
        dealerSum = calculateSum(dealerCards);
    }    

    renderDealer();
    determineWinner();
}



function determineWinner() {
    if (dealerSum > 21) {
        messageEl.textContent = "Dealer busts! You win!";
        player.chips += bet * 2;
    } else if (dealerSum === sum) {
        messageEl.textContent = "It's a tie!";
        player.chips += bet; // Refund the bet
    } else if (dealerSum > sum) {
        messageEl.textContent = "Dealer wins!";
    } else {
        messageEl.textContent = "You win!";
        player.chips += bet * 2;
    }

    resetBet();
    playerEl.textContent = player.name + ": $" + player.chips;
}

