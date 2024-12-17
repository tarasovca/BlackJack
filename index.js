let player = {
    name: "Dima",
    chips: 2000
}

let cards = []
let sum = 0
let hasBlackJack = false
let isAlive = false
let message = ""
let bet = 0

let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let cardsEl = document.getElementById("cards-el")
let playerEl = document.getElementById("player-el")
let betEl = document.getElementById("bet-el")
let betInput = document.getElementById("bet-input")

playerEl.textContent = player.name + ": $" + player.chips

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
    
    bet = betAmount
    player.chips -= bet
    playerEl.textContent = player.name + ": $" + player.chips
    betEl.textContent = "Your bet: $" + bet
    isAlive = true 
    //startGame()
    cardsEl.textContent = "Cards: "
    sumEl.textContent = "Sum: "
}

function getRandomCard() {
    let randomNumber = Math.floor(Math.random() * 13) + 1
    if (randomNumber > 10) {
        return 10
    } else if (randomNumber === 1) {
        return 11
    } else {
        return randomNumber
    }
}

function startGame() {
    if (bet === 0) {
        betEl.textContent = "You need to place a bet first!"
        return
    }
    if (cards.length > 0) {
        messageEl.textContent = "Cards are already dealt. Draw a new card!";
        return;
    }
    isAlive = true
    hasBlackJack = false
    let firstCard = getRandomCard()
    let secondCard = getRandomCard()
    cards = [firstCard, secondCard]
    sum = firstCard + secondCard
    renderGame()
}

function renderGame() {
    
    cardsEl.textContent = "Cards: "
    for (let i = 0; i < cards.length; i++) {
        cardsEl.textContent += cards[i] + " "
    }
    
    sumEl.textContent = "Sum: " + sum
    if (sum <= 20) {
        message = "Do you want to draw a new card?"
    } else if (sum === 21) {
        message = "You've got Blackjack!"
        hasBlackJack = true
        player.chips += bet * 2
        resetBet()
    } else {
        message = "You're out of the game!"
        isAlive = false
        resetBet()
    }
    messageEl.textContent = message
    playerEl.textContent = player.name + ": $" + player.chips
}

function newCard() {

    if (!isAlive || cards.length === 0) {
        messageEl.textContent = "You need to start the game first!";
        return;
    }

    if (isAlive === true && hasBlackJack === false) {
        let card = getRandomCard()
        sum += card
        cards.push(card)
        renderGame()
    }
}

function resetBet() {
    bet = 0
    betEl.textContent = "Bet is settled. Place a new bet!"
    betInput.value = ""
}
