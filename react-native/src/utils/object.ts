/**
 * Removes specified properties from an object
 * @param obj The source object
 * @param keys Array of keys to remove
 * @returns A new object without the specified keys
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
} 