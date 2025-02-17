let player = {
    name: "Dima",
    chips: 5000
  };
  
  let cards = [];
  let sum = 0;
  let hasBlackJack = false;
  let isAlive = false;
  let message = "";
  let bet = 0;
  
  let dealerCards = [];
  let dealerSum = 0;
  
  let messageEl = document.getElementById("message-el");
  let sumEl = document.getElementById("sum-el");
  let cardsEl = document.getElementById("cards-el");
  let playerEl = document.getElementById("player-el");
  let betEl = document.getElementById("bet-el");
  let betInput = document.getElementById("bet-input");
  
  // Set initial player info on load
  window.onload = function () {
    document.getElementById("start-game-btn").disabled = false;
    playerEl.textContent = player.name + ": $" + player.chips;
  };
  
  function calculateSum(hand) {
    let total = 0;
    let aceCount = 0;
    for (let card of hand) {
      if (card.rank > 10) {
        total += 10;
      } else if (card.rank === 1) {
        total += 11;
        aceCount++;
      } else {
        total += card.rank;
      }
    }
    // Adjust Aces from 11 to 1 if total exceeds 21
    while (total > 21 && aceCount > 0) {
      total -= 10;
      aceCount--;
    }
    return total;
  }
  
  // Reset game state for a new round (but not player chips)
  function resetGameState() {
    cards = [];
    sum = 0;
    hasBlackJack = false;
    isAlive = false;
  }
  
  // Betting function
  function makeBet() {
    let betAmount = parseInt(betInput.value);
    
    if (isNaN(betAmount) || betAmount <= 0) {
      betEl.textContent = "Enter a valid bet amount!";
      return;
    }
    
    if (betAmount > player.chips) {
      betEl.textContent = "You don't have enough chips!";
      return;
    }
  
    resetGameState();
    bet = betAmount;
    player.chips -= bet;
    playerEl.textContent = player.name + ": $" + player.chips;
    betEl.textContent = "Your bet: $" + bet;
    isAlive = true; 
    cardsEl.textContent = "Cards: ";
    sumEl.textContent = "Sum: ";
  }
  
  // Return a random card object
  function getRandomCard() {
    let suits = ["♠", "♥", "♦", "♣"];
    let rank = Math.floor(Math.random() * 13) + 1;
    let suit = suits[Math.floor(Math.random() * suits.length)];
    return { rank, suit };
  }
  
  // Convert a card object to a readable string
  function cardToString(card) {
    let rankStr;
    switch (card.rank) {
      case 1:
        rankStr = "A";
        break;
      case 11:
        rankStr = "J";
        break;
      case 12:
        rankStr = "Q";
        break;
      case 13:
        rankStr = "K";
        break;
      default:
        rankStr = card.rank;
    }
    return `${rankStr}${card.suit}`;
  }
  
  function startGame() {
    if (bet === 0) {
      betEl.textContent = "You need to place a bet first!";
      return;
    }
    // Disable "Start Game" button during a round
    document.getElementById("start-game-btn").disabled = true;
    resetGameState();
    isAlive = true;
    
    // Player's initial cards
    let firstCard = getRandomCard();
    let secondCard = getRandomCard();
    cards = [firstCard, secondCard];
    sum = calculateSum(cards);
  
    // Dealer's initial cards
    let dealerFirstCard = getRandomCard();
    let dealerSecondCard = getRandomCard();
    dealerCards = [dealerFirstCard, dealerSecondCard];
    dealerSum = calculateSum(dealerCards);
  
    renderGame();
    renderDealer();
  }
  
  function renderGame() {
    cardsEl.textContent = "Cards: " + cards.map(cardToString).join(" ");
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
    dealerCardsEl.textContent = "Dealer's Cards: " + dealerCards.map(cardToString).join(" ");
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
    }
  }
  
  // Reset bet for the next round and re-enable Start Game
  function resetBet() {
    bet = 0;
    betEl.textContent = "Bet is settled. Place a new bet!";
    betInput.value = "";
    document.getElementById("start-game-btn").disabled = false;
  }
  
  // Dealer's turn with animated card draws
  function dealerTurn() {
    messageEl.textContent = "Dealer's turn...";
    let dealerInterval = setInterval(() => {
      if (dealerSum < 17) {
        let card = getRandomCard();
        dealerCards.push(card);
        dealerSum = calculateSum(dealerCards);
        renderDealer();
      } else {
        clearInterval(dealerInterval);
        determineWinner();
      }
    }, 1000);
  }
  
  function determineWinner() {
    if (dealerSum > 21) {
      messageEl.textContent = "Dealer busts! You win!";
      player.chips += bet * 2;
    } else if (dealerSum === sum) {
      messageEl.textContent = "It's a tie!";
      player.chips += bet; // Refund bet
    } else if (dealerSum > sum) {
      messageEl.textContent = "Dealer wins!";
    } else {
      messageEl.textContent = "You win!";
      player.chips += bet * 2;
    }
    resetBet();
    playerEl.textContent = player.name + ": $" + player.chips;
  }
  
  function stand() {
    if (!isAlive || cards.length === 0) {
      messageEl.textContent = "You need to start the game first!";
      return;
    }
    isAlive = false;
    dealerTurn();
  }
  
  // New functionality: Double Down
  function doubleDown() {
    if (!isAlive || cards.length !== 2) {
      messageEl.textContent = "Double Down is only available on your initial two cards!";
      return;
    }
    if (player.chips < bet) {
      messageEl.textContent = "You don't have enough chips to double down!";
      return;
    }
    // Deduct additional bet and double the wager
    player.chips -= bet;
    bet *= 2;
    playerEl.textContent = player.name + ": $" + player.chips;
    betEl.textContent = "Your bet doubled to: $" + bet;
    
    // Draw one additional card and then automatically stand
    let card = getRandomCard();
    cards.push(card);
    sum = calculateSum(cards);
    renderGame();
    setTimeout(stand, 1000);
  }
  
  // New functionality: Restart Game
  function restartGame() {
    resetGameState();
    dealerCards = [];
    dealerSum = 0;
    bet = 0;
    betInput.value = "";
    messageEl.textContent = "Game restarted. Place your bet to start!";
    cardsEl.textContent = "Cards: ";
    sumEl.textContent = "Sum: ";
    document.getElementById("dealer-cards-el").textContent = "Dealer's Cards: ";
    document.getElementById("dealer-sum-el").textContent = "Dealer's Sum: ";
    document.getElementById("start-game-btn").disabled = false;
  }
  