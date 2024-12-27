# Blackjack Game

A simple web-based Blackjack game where you can place bets, draw cards, and try to beat the dealer. The game includes dynamic card handling, betting logic, and an intuitive interface for an enjoyable experience.

---

## Features
- **Dynamic Card Handling**:
  - Cards include suits (`♠, ♥, ♦, ♣`) and ranks (Ace, 2-10, Jack, Queen, King).
  - Aces can dynamically count as `1` or `11`, ensuring you don't bust unnecessarily.
- **Place a Bet**: Set your desired bet amount before starting the game.
- **Player and Dealer Logic**:
  - Player can draw cards until they stand or bust.
  - Dealer automatically plays by Blackjack rules (must draw until reaching 17 or higher).
- **Win or Lose**:
  - Automatically determine the winner, handling ties, Blackjack, or bust scenarios.
- **Player Chips**: Chips update dynamically as you win or lose rounds.

---

## How to Play
1. Place your bet using the input field.
2. Press **"START GAME"** to receive your first two cards.
3. Decide if you want to draw a new card by pressing **"NEW CARD"**.
4. When ready, press **"STAND"** to end your turn and let the dealer play.
5. The game ends when:
   - Your card sum exceeds 21 (you lose).
   - You hit 21 (Blackjack - you win!).
   - The dealer busts (you win) or beats your sum (you lose).
6. Your chips are updated based on the outcome.

---

## Technologies Used
- HTML: To structure the game interface.
- CSS: For styling the game, including a visually appealing card table design.
- JavaScript: To handle game logic, card mechanics, and chip calculations.
