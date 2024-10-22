const board = document.querySelector(".board");
const ball = document.querySelector(".ball");
const paddleLeft = document.querySelector(".paddle-left");
const paddleRight = document.querySelector(".paddle-right");
const winScreen = document.querySelector(".win-screen");
const loseScreen = document.querySelector(".lose-screen");
const tryAgainButtons = document.querySelectorAll(".try-again");
const characterDisplay = document.querySelector(".character-display");

let ballX = board.clientWidth / 2;
let ballY = board.clientHeight / 2;
let ballSpeedX = 4; // Start with a faster speed
let ballSpeedY = 4;
const initialBallSpeedX = 4;
const initialBallSpeedY = 4;
const maxBallSpeed = 8; // Maximum ball speed

let leftScore = 0;
let rightScore = 0;

let paddleLeftSpeed = 0;
let paddleRightSpeed = 0;

let hitCount = 0;
let gameRunning = true;

const characters = ["b", "+", "a", "-", "l", "+", "d", "+", "u", "-", "r"];
let characterIndex = 0;

function update() {
  if (!gameRunning) return;

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY >= board.clientHeight - ball.clientHeight) {
    ballSpeedY = -ballSpeedY;
  }

  if (ballX <= paddleLeft.clientWidth) {
    if (
      ballY + ball.clientHeight >= paddleLeft.offsetTop &&
      ballY <= paddleLeft.offsetTop + paddleLeft.clientHeight
    ) {
      ballSpeedX = Math.abs(ballSpeedX); // Ensure ball bounces correctly
      addRandomness();
      increaseBallSpeed();
      displayCharacter();
    } else {
      rightScore++;
      checkGameOver();
      resetBall();
    }
  }

  if (ballX >= board.clientWidth - paddleRight.clientWidth - ball.clientWidth) {
    if (
      ballY + ball.clientHeight >= paddleRight.offsetTop &&
      ballY <= paddleRight.offsetTop + paddleRight.clientHeight
    ) {
      ballSpeedX = -Math.abs(ballSpeedX); // Ensure ball bounces correctly
      addRandomness();
      increaseBallSpeed();
    } else {
      leftScore++;
      checkGameOver();
      resetBall();
    }
  }

  // AI movement
  if (ballY < paddleRight.offsetTop + paddleRight.clientHeight / 2) {
    paddleRightSpeed = -5;
  } else {
    paddleRightSpeed = 5;
  }

  paddleLeft.style.top = `${Math.max(0, Math.min(board.clientHeight - paddleLeft.clientHeight, paddleLeft.offsetTop + paddleLeftSpeed))}px`;
  paddleRight.style.top = `${Math.max(0, Math.min(board.clientHeight - paddleRight.clientHeight, paddleRight.offsetTop + paddleRightSpeed))}px`;

  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;

  document.querySelector(".left-score").textContent = leftScore;
  document.querySelector(".right-score").textContent = rightScore;

  requestAnimationFrame(update);
}

function resetBall() {
  ballX = board.clientWidth / 2;
  ballY = board.clientHeight / 2;
  ballSpeedX = initialBallSpeedX;
  ballSpeedY = initialBallSpeedY;
  hitCount = 0;
}

function increaseBallSpeed() {
  hitCount++;
  const speedFactor = 1 + 0.1 * Math.log(hitCount + 1); // Controlled speed increase
  ballSpeedX = Math.min(maxBallSpeed, ballSpeedX * speedFactor);
  ballSpeedY = Math.min(maxBallSpeed, ballSpeedY * speedFactor);
}

function addRandomness() {
  const angle = ((Math.random() - 0.5) * Math.PI) / 4; // Random angle between -45 and 45 degrees
  const speed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);
  ballSpeedX = Math.sign(ballSpeedX) * speed * Math.cos(angle);
  ballSpeedY = speed * Math.sin(angle);
}

function displayCharacter() {
  if (characterIndex < characters.length) {
    characterDisplay.textContent += characters[characterIndex];
    characterIndex++;
  }
}

function checkGameOver() {
  if (leftScore >= 3) {
    winScreen.classList.remove("hidden");
    gameRunning = false;
  } else if (rightScore >= 3) {
    loseScreen.classList.remove("hidden");
    characterDisplay.textContent = ""; // Reset character display on loss
    characterIndex = 0;
    gameRunning = false;
  }
}

function resetGame() {
  leftScore = 0;
  rightScore = 0;
  document.querySelector(".left-score").textContent = leftScore;
  document.querySelector(".right-score").textContent = rightScore;
  winScreen.classList.add("hidden");
  loseScreen.classList.add("hidden");
  characterDisplay.textContent = "";
  characterIndex = 0;
  gameRunning = true;
  resetBall();
  update();
}

tryAgainButtons.forEach((button) => {
  button.addEventListener("click", resetGame);
});

document.addEventListener("keydown", (e) => {
  const paddleSpeed = 5;
  if (e.key === "w") {
    paddleLeftSpeed = -paddleSpeed;
  }
  if (e.key === "s") {
    paddleLeftSpeed = paddleSpeed;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "w" || e.key === "s") {
    paddleLeftSpeed = 0;
  }
});

update();
