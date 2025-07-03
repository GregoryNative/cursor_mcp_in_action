export const getRandomIndex = (length) => () =>
  Math.floor(Math.random() * length);

export function* generateEntityObjects(count, objectGenerator) {
  for (let i = 0; i < count; i++) {
    yield objectGenerator(i);
  }
}

export function generateNumericCode(length) {
  if (length <= 0) return 0;
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1));
}

export function prefixNumericCode(number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const prefix = Array.from(
    { length: 3 },
    () => chars[getRandomIndex(chars.length)()],
  ).join("");

  return `${prefix}${number}`;
}

export function round(value, precision) {
  var power = Math.pow(10, precision || 0);
  return Math.round(value * power) / power;
}

export const getRandomKey = (...keys) => keys[getRandomIndex(keys.length)()];

export function getRandomNumInRange(min, max) {
  min = Math.ceil(min); // Ensure min is an integer (round up)
  max = Math.floor(max); // Ensure max is an integer (round down)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomUniqueItems(arr, n) {
  if (n <= 0) return [];
  if (n >= arr.length) return [...arr].sort(() => Math.random() - 0.5);
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > shuffled.length - n - 1; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(-n);
}
