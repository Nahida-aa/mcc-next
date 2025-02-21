import SQIds, { defaultOptions } from "sqids";

export const djb2 = (s: string) => {
  let h = 5381;
  let i = s.length;
  while (i) {
    h = (h * 33) ^ s.charCodeAt(--i);
  }
  return (h & 0xbfffffff) | ((h >>> 1) & 0x40000000);
}

// A simple function to shuffle the alphabet for the Sqids
export const shuffle = (str: string, seed: string) => {
  const chars = str.split("");
  const seedNum = djb2(seed);

  let temp: string;
  let j: number;
  for (let i = 0; i < chars.length; i++) {
    j = ((seedNum % (i + 1)) + i) % chars.length;
    temp = chars[i];
    chars[i] = chars[j];
    chars[j] = temp;
  }

  return chars.join("");
}

