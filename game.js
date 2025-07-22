const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 360;
canvas.height = 640;

// Game state
let gameState = 'start';
let score = 0;
const gravity = 0.4;
const jumpStrength = -10;
let frog = { x: 180, y: 500, w: 32, h: 32, vy: 0 };
let pads = [];
let keys = {};

// Load frog image
const frogImg = new Image();
frogImg.src = 'assets/images/430A4304-7A9C-47F8-8A7E-517B961F1643.png';

// UI elements
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreEl = document.getElementById('finalScore');
const startBtn = document.getElementById('startButton');
const restartBtn = document.getElementById('restartButton');
const shareBtn = document.getElementById('shareButton');

startBtn.onclick = startGame;
restartBtn.onclick = startGame;
shareBtn.onclick = shareScore;

// Create initial pads
function initPads() {
  pads = [];
  for (let i = 0; i < 8; i++) {
    pads.push({
      x: Math.random() * (canvas.width - 70),
      y: 80 * i,
      w: 70,
      h: 12
    });
  }
}

// Start game
function startGame() {
  gameState = 'running';
  score = 0;
  frog = { x: 180, y: 500, w: 32, h: 32, vy: 0 };
  initPads();
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  loop();
}

// Main game loop
function loop() {
  if (gameState !== 'running') return;
  update();
  draw();
  requestAnimationFrame(loop);
}

// Update game state
function update() {
  frog.vy += gravity;
  frog.y += frog.vy;

  // Left-right movement
  if (keys['ArrowLeft'] || keys['a']) frog.x -= 3;
  if (keys['ArrowRight'] || keys['d']) frog.x += 3;

  // Wrap around edges
  if (frog.x < -frog.w) frog.x = canvas.width;
  if (frog.x > canvas.width) frog.x = -frog.w;

  // Pad collisions
  for (let pad of pads) {
    if (
      frog.vy > 0 &&
      frog.x + frog.w > pad.x &&
      frog.x < pad.x + pad.w &&
      frog.y + frog.h >= pad.y &&
      frog.y + frog.h <= pad.y + pad.h
    ) {
      frog.vy = jumpStrength;
      score++;
    }
  }

  // Scroll world if frog goes high
  if (frog.y < 200) {
    let dy = 200 - frog.y;
    frog.y = 200;
    pads.forEach(p => p.y += dy);
    score += Math.floor(dy / 5);
  }

  // Remove old pads / add new ones
  for (let i = 0; i < pads.length; i++) {
    if (pads[i].y > canvas.height) {
      pads.splice(i, 1);
      pads.push({
        x: Math.random() * (canvas.width - 70),
        y: -20,
        w: 70,
        h: 12
      });
    }
  }

  // Game over
  if (frog.y > canvas.height) gameOver();
}

// Draw the game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = '#aef';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Pads
  ctx.fillStyle = '#2e8b57';
  for (let pad of pads) {
    ctx.fillRect(pad.x, pad.y, pad.w, pad.h);
  }

  // Frog sprite
  ctx.drawImage(frogImg, frog.x, frog.y, frog.w, frog.h);

  // Score
  ctx.fillStyle = '#fff';
  ctx.font = '18px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

// Game over
function gameOver() {
  gameState = 'over';
  finalScoreEl.innerText = 'Score: ' + score;
  gameOverScreen.classList.remove('hidden');
}

// Controls
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// Farcaster share
function shareScore() {
  const castText = `#Tobyworld #SatobySwap\n$Patience <> $Toby <> $Taboshi\nI scored ${score} in Toad Jumper!`;
  window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}`);
}
