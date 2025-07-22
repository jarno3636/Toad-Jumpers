const canvas=document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');
canvas.width=360; canvas.height=640;
let gameState='start';
let score=0;
let frog={ x:180, y:100, w:32, h:32, vy:0 };
let pads=[];
let gravity=0.6;
const startScreen=document.getElementById('startScreen');
const gameOverScreen=document.getElementById('gameOverScreen');
const finalScore=document.getElementById('finalScore');
document.getElementById('startButton').onclick=startGame;
document.getElementById('restartButton').onclick=startGame;
document.getElementById('shareButton').onclick=shareScore;

function startGame(){
  gameState='running';
  score=0;
  frog.y=100; frog.vy=0;
  pads=[{x:140,y:580,w:80,h:16}];
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  loop();
}

function loop(){
  if(gameState!=='running')return;
  update(); draw();
  requestAnimationFrame(loop);
}

function update(){
  frog.vy+=gravity; frog.y+=frog.vy;
  if(frog.y+frog.h>canvas.height){return gameOver();}
  pads.forEach((p,i)=>{
    p.y-=2;
    if(p.y< -p.h){
      pads.splice(i,1);
      pads.push({x:Math.random() * (canvas.width - p.w),y:canvas.height,w:p.w,h:p.h});
    }
    if(
      frog.vy>0 &&
      frog.x + frog.w > p.x &&
      frog.x < p.x + p.w &&
      frog.y + frog.h >= p.y &&
      frog.y + frog.h <= p.y + p.h
    ){
      frog.vy=-12;
      frog.y = p.y - frog.h;
      score++;
    }
  });
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='blue'; ctx.fillRect(frog.x,frog.y,frog.w,frog.h);
  ctx.fillStyle='#0a0'; pads.forEach(p=>ctx.fillRect(p.x,p.y,p.w,p.h));
  ctx.fillStyle='#fff'; ctx.font='20px sans-serif'; ctx.fillText('Score: '+score,10,30);
}

function gameOver(){
  gameState='over';
  finalScore.innerText='Score: '+score;
  gameOverScreen.classList.remove('hidden');
}

window.addEventListener('mousemove',e=>{
  const rect=canvas.getBoundingClientRect();
  frog.x=e.clientX-rect.left-frog.w/2;
});

window.addEventListener('keydown',e=>{
  if(e.code==='Space' && gameState==='running') frog.vy=-12;
});

function shareScore(){
  const text = `#Tobyworld #SatobySwap
$Patience <> $Toby <> $Taboshi
I scored ${score} in Toad Jumper!`;
  const urlText = encodeURIComponent(text);
  window.open(`https://warpcast.com/~/compose?text=${urlText}`);
}
