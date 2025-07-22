// lore.js (simple unlockable lore logic placeholder)
export const loreUnlocked = [false,false,false];

export function unlockLore(index){
  loreUnlocked[index]=true;
}

export function isLoreUnlocked(index){
  return loreUnlocked[index];
}
