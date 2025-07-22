const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 360;
canvas.height = 640;

let gameState = 'start';
let score = 0;

const frogImg = new Image();
frogImg.src = 'assets/images/frog_pixel.png'; // Optional: replace with your asset

let frog = {
  x: 180,
  y: 580,
  w: 32,
  h: 32,
  vy: 0,
  vx: 0
};

let pads = [];
const gravity = 0.6;

const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreEl = document.getElementById('finalScore');
const startBtn = document.getElementById('startButton');
const restartBtn = document.getElementById('restartButton');
const shareBtn = document.getElementById('shareButton');

startBtn.onclick = startGame;
restartBtn.onclick = startGame;
shareBtn.onclick = shareScore;

function startGame() {
  gameState = 'running';
  score = 0;
  frog = { x: 180, y: 580, w: 32, h: 32, vy: -12, vx: 0 };
  pads = [];
  for (let i = 0; i < 6; i++) {
    pads.push({
      x: Math.random() * (canvas.width - 80),
      y: i * 120,
      w: 80,
      h: 16
    });
  }
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  loop();
}

function loop() {
  if (gameState !== 'running') return;
  update();
  draw();
  requestAnimationFrame(loop);
}

function update() {
  frog.vy += gravity;
  frog.y += frog.vy;

  // Move platforms down
  pads.forEach((p) => (p.y += 2));
  pads = pads.filter((p) => p.y < canvas.height + p.h);

  // Add new pad
  if (pads.length < 6) {
    pads.unshift({
      x: Math.random() * (canvas.width - 80),
      y: -20,
      w: 80,
      h: 16
    });
  }

  // Collision
  for (const p of pads) {
    if (
      frog.vy > 0 &&
      frog.x + frog.w > p.x &&
      frog.x < p.x + p.w &&
      frog.y + frog.h >= p.y &&
      frog.y + frog.h <= p.y + p.h
    ) {
      frog.vy = -12;
      score++;
    }
  }

  // Boundaries
  if (frog.y + frog.h > canvas.height) {
    return gameOver();
  }
  if (frog.x < 0) frog.x = 0;
  if (frog.x + frog.w > canvas.width) frog.x = canvas.width - frog.w;

  frog.x += frog.vx * 4;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#334';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw pads
  ctx.fillStyle = '#0f0';
  for (const p of pads) {
    ctx.fillRect(p.x, p.y, p.w, p.h);
  }

  // Draw frog
  if (frogImg.complete) {
    ctx.drawImage(frogImg, frog.x, frog.y, frog.w, frog.h);
  } else {
    ctx.fillStyle = '#00f';
    ctx.fillRect(frog.x, frog.y, frog.w, frog.h);
  }

  // Score
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

function gameOver() {
  gameState = 'over';
  finalScoreEl.innerText = 'Score: ' + score;
  gameOverScreen.classList.remove('hidden');
}

window.addEventListener('keydown', (e) => {
  if (gameState === 'running') {
    if (e.code === 'ArrowLeft') frog.vx = -1;
    if (e.code === 'ArrowRight') frog.vx = 1;
    if (e.code === 'Space') frog.vy = -12;
  }
});

window.addEventListener('keyup', (e) => {
  if (['ArrowLeft', 'ArrowRight'].includes(e.code)) {
    frog.vx = 0;
  }
});

function shareScore() {
  const castText = `#Tobyworld #SatobySwap\n$Patience <> $Toby <> $Taboshi\nI scored ${score} in Toad Jumper!`;
  window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}`);
}
