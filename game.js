const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 360;
canvas.height = 640;

let gameState = 'start';
let score = 0;
let frog = { x: 180, y: 100, w: 32, h: 32, vy: 0 };
let pads = [];
const gravity = 0.6;

const frogImg = new Image();
frogImg.src = 'assets/images/430A4304-7A9C-47F8-8A7E-517B961F1643.png';

const padImg = new Image();
padImg.src = 'assets/images/A_set_of_four_2D_pixel_art_lily_pad_sprites_is_arr.png';

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
  frog = { x: 180, y: 100, w: 32, h: 32, vy: 0 };
  pads = [{ x: 140, y: 580, w: 80, h: 16 }];
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  canvas.classList.remove('hidden');
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

  if (frog.y + frog.h > canvas.height) return gameOver();

  pads.forEach((p, i) => {
    p.y -= 2;
    if (p.y < -p.h) {
      pads.splice(i, 1);
      pads.push({
        x: Math.random() * (canvas.width - 80),
        y: canvas.height,
        w: 80,
        h: 16
      });
    }

    if (
      frog.vy > 0 &&
      frog.x + frog.w > p.x &&
      frog.x < p.x + p.w &&
      frog.y + frog.h >= p.y &&
      frog.y + frog.h <= p.y + p.h
    ) {
      frog.vy = -12;
      frog.y = p.y - frog.h;
      score++;
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(frogImg, frog.x, frog.y, frog.w, frog.h);

  pads.forEach(p => {
    ctx.drawImage(padImg, 0, 0, 80, 16, p.x, p.y, p.w, p.h);
  });

  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);
}

function gameOver() {
  gameState = 'over';
  finalScoreEl.innerText = 'Score: ' + score;
  gameOverScreen.classList.remove('hidden');
  canvas.classList.add('hidden');
}

window.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  frog.x = e.clientX - rect.left - frog.w / 2;
});

window.addEventListener('keydown', e => {
  if (e.code === 'Space' && gameState === 'running') {
    frog.vy = -12;
  }
});

function shareScore() {
  const castText = `#Tobyworld #SatobySwap\n$Patience <> $Toby <> $Taboshi\nI scored ${score} in Toad Jumper!`;
  window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}`);
}