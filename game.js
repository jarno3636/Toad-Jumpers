const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 360;
canvas.height = 640;

// Assets
const frogImg = new Image();
frogImg.src = 'assets/images/430A4304-7A9C-47F8-8A7E-517B961F1643.png';

// State
let gameState = 'start';
let score = 0;
let frog = { x: 160, y: 500, w: 32, h: 32, vy: -10 };
let pads = [];
const gravity = 0.4;
let keys = {};

// UI
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreEl = document.getElementById('finalScore');
const startBtn = document.getElementById('startButton');
const restartBtn = document.getElementById('restartButton');
const shareBtn = document.getElementById('shareButton');

startBtn.onclick = startGame;
restartBtn.onclick = startGame;
shareBtn.onclick = shareScore;

function initPads() {
  pads = [];
  for (let i = 0; i < 8; i++) {
    pads.push({
      x: Math.random() * (canvas.width - 70),
      y: i * 80,
      w: 70,
      h: 12,
    });
  }
}

function startGame() {
  gameState = 'running';
  score = 0;
  frog = { x: 160, y: 500, w: 32, h: 32, vy: -10 };
  initPads();
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  requestAnimationFrame(loop);
}

function update() {
  frog.vy += gravity;
  frog.y += frog.vy;

  if (keys['ArrowLeft'] || keys['a']) frog.x -= 3;
  if (keys['ArrowRight'] || keys['d']) frog.x += 3;

  if (frog.x < -frog.w) frog.x = canvas.width;
  if (frog.x > canvas.width) frog.x = -frog.w;

  // Frog jumps on pad
  pads.forEach(p => {
    if (
      frog.vy > 0 &&
      frog.x + frog.w > p.x &&
      frog.x < p.x + p.w &&
      frog.y + frog.h >= p.y &&
      frog.y + frog.h <= p.y + p.h
    ) {
      frog.vy = -10;
      frog.y = p.y - frog.h;
      score++;
    }
  });

  // Scroll pads downward if frog goes high
  if (frog.y < 200) {
    const offset = 200 - frog.y;
    frog.y = 200;
    pads.forEach(p => p.y += offset);
    score += Math.floor(offset / 10);
  }

  // Recycle pads
  for (let i = 0; i < pads.length; i++) {
    if (pads[i].y > canvas.height) {
      pads.splice(i, 1);
      pads.push({
        x: Math.random() * (canvas.width - 70),
        y: -20,
        w: 70,
        h: 12,
      });
    }
  }

  // Game over
  if (frog.y > canvas.height) {
    gameState = 'over';
    finalScoreEl.innerText = 'Score: ' + score;
    gameOverScreen.classList.remove('hidden');
  }
}

function draw() {
  ctx.fillStyle = '#b4ecff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#006600';
  for (let pad of pads) {
    ctx.fillRect(pad.x, pad.y, pad.w, pad.h);
  }

  ctx.drawImage(frogImg, frog.x, frog.y, frog.w, frog.h);

  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

function loop() {
  if (gameState !== 'running') return;
  update();
  draw();
  requestAnimationFrame(loop);
}

// Controls
window.addEventListener('keydown', e => (keys[e.key] = true));
window.addEventListener('keyup', e => (keys[e.key] = false));

function shareScore() {
  const castText = `#Tobyworld #SatobySwap\n$Patience <> $Toby <> $Taboshi\nI scored ${score} in Toad Jumper!`;
  window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}`);
}
