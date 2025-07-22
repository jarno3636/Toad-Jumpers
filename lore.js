export function updateLorePage(){
  const lotus = tokenCounts.lotus;
  if(lotus >= 1){
    document.getElementById('rune1Text').innerText = `"In the beginning, a single croak echoed across the chain..."`;
    document.getElementById('rune1').classList.add('unlocked');
  }
  if(lotus >= 2){
    // similar for rune2
  }
  if(lotus >= 3){
    // similar for rune3
  }
}

document.getElementById('castLore').onclick = () => {
  const text = `📜 I unlocked ancient scrolls in Toad Jumper! 🌸 ${tokenCounts.lotus} Lotus\nhttps://jarno3636.github.io/toadjumper/`;
  window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`);
};

document.getElementById('closeLore').onclick = () => {
  document.getElementById('lorePage').classList.add('hidden');
  document.getElementById('startScreen').classList.remove('hidden');
};
