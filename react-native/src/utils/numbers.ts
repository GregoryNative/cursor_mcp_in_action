/**
 * Generates a random integer between min (inclusive) and max (inclusive)
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns A random integer between min and max
 */
export function getRandomInt(min: number = 0, max: number = 50): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
