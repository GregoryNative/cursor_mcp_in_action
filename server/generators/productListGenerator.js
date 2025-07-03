import { randomUUID } from "crypto";
import productNames from "../data/productNames.json" with { type: "json" };
import images from "../data/productFileNames.json" with { type: "json" };
import {
  getRandomIndex,
  generateEntityObjects,
  generateNumericCode,
  prefixNumericCode,
} from "./lib.js";

function generateRandomProductName(namesArray) {
  const randomIndex = getRandomIndex(namesArray.length);
  return `${namesArray[randomIndex()][0]} ${namesArray[randomIndex()][1]} ${namesArray[randomIndex()][2]}`;
}

function generateRandomPrice() {
  const price = Math.random() * (500 - 1) + 1;
  return Math.random() > 0.5 ? parseFloat(price.toFixed(2)) : Math.floor(price);
}

function getRandomImage() {
  return `images/products/${images[getRandomIndex(images.length)()]}`;
}

function generateOptions() {
  const colors = ["Red", "Green", "Yellow", "Blue", "Brown", "Gray", "Silver"];
  const sizes = ["M7", "M8", "M9", "M10", "M11", "M12", "W7", "W8", "W9"];

  return Math.random() < 0.5
    ? null
    : {
        color: Array.from({ length: getRandomIndex(5)() + 1 }).map(
          () => colors[getRandomIndex(colors.length)()],
        ),
        size: Array.from({ length: getRandomIndex(5)() + 1 }).map(
          () => sizes[getRandomIndex(sizes.length)()],
        ),
      };
}

function generateQuantity() {
  const quantity = getRandomIndex(20)();
  return {
    status: quantity > 0 ? "in_stock" : "out_of_stock",
    quantity,
  };
}

function getProductEntity() {
  return {
    id: randomUUID(),
    image: getRandomImage(),
    name: generateRandomProductName(productNames),
    price: generateRandomPrice(),
    options: generateOptions(),
    sku: prefixNumericCode(generateNumericCode(6)),
    barcode: generateNumericCode(12),
    inventory: generateQuantity(),
  };
}

export function generateProducts(count) {
  return [...generateEntityObjects(count, getProductEntity)];
}

// const productCount = 12; //50000;

// const res = generateProducts(productCount);

// console.log(JSON.stringify(res, null, 2));
// const filename = path.join("data", "generatedData", "productList.json");
// fs.writeFileSync(filename, JSON.stringify(res, null, 2), "utf8");
