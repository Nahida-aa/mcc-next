// server/utils

import { randomBytes } from 'crypto';

export function genUUIDonServer(): string {
  const array = randomBytes(16);

  array[6] = (array[6] & 0x0f) | 0x40; // 设置版本号为 4
  array[8] = (array[8] & 0x3f) | 0x80; // 设置 variant 为 10

  const hexArray = Array.from(array, byte => byte.toString(16).padStart(2, '0'));
  return `${hexArray.slice(0, 4).join('')}-${hexArray.slice(4, 6).join('')}-${hexArray.slice(6, 8).join('')}-${hexArray.slice(8, 10).join('')}-${hexArray.slice(10, 16).join('')}`;
}