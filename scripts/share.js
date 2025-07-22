export const tokenCounts = {
  toby: 0, patience: 0, taboshi: 0, lotus: 0
};

export function updateTokenHUD(){
  document.getElementById('tobyCount').innerText     = `🌀 x${tokenCounts.toby}`;
  document.getElementById('patienceCount').innerText = `🔺 x${tokenCounts.patience}`;
  document.getElementById('taboshiCount').innerText  = `🍃 x${tokenCounts.taboshi}`;
  document.getElementById('lotusCount').innerText    = `🌸 x${tokenCounts.lotus}`;
}

export function shareScore(score){
  const text = `#Tobyworld #SatobySwap
$Patience <> $Toby <> $Taboshi
I scored ${score} in Toad Jumper!`;
  window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`);
}

document.getElementById('shareButton').onclick = () => {
  shareScore(score);
};
