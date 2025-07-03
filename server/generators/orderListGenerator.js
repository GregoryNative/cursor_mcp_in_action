import { randomUUID } from "crypto";
import {
  generateEntityObjects,
  generateNumericCode,
  getRandomIndex,
  getRandomKey,
  round,
} from "./lib.js";

import names from "../data/names.json" with { type: "json" };

function generateOrderNumber(prefix) {
  return `${prefix}${generateNumericCode(4)}`;
}

function generateCreatedDataTime() {
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 0, 1).getTime();
  const end = new Date(year, 11, 31, 23, 59, 59).getTime();
  const randomTimestamp = Math.floor(Math.random() * (end - start + 1)) + start;

  const randomDate = new Date(randomTimestamp);

  return {
    date: randomDate.toISOString().split("T")[0],
    time: randomDate.toTimeString().split(" ")[0],
  };
}

function generateSoldBy(namesArray) {
  const randomIndex = getRandomIndex(namesArray.length);
  return `${namesArray[randomIndex()][0]} ${namesArray[randomIndex()][1]}`;
}

function generateDescriptionLine(productOptions) {
  return Object.entries(productOptions).map(([key, values]) => {
    return `${key}: ${values[getRandomIndex(values.length)()]}`;
  });
}

function productItemEntity(products) {
  return () => {
    const product = products[getRandomIndex(products.length)()];
    const quantity = getRandomIndex(5)() + 1;

    return {
      lineItemId: randomUUID(),
      productId: product.id,
      image: product.image,
      name: product.name,
      price: product.price,
      totalPrice: round(quantity * product.price, 2),
      quantity,
      descriptionLines: product.options
        ? generateDescriptionLine(product.options)
        : null,
    };
  };
}

function getOrderEntity(products) {
  return () => {
    const items = [
      ...generateEntityObjects(
        getRandomIndex(10)() + 1,
        productItemEntity(products),
      ),
    ];

    const total = round(
      items.reduce((sum, n) => sum + n.totalPrice, 0),
      2,
    );

    return {
      id: randomUUID(),
      orderNumber: generateOrderNumber("1000"),
      orderReferenceId: generateOrderNumber("PI000-"),
      created: generateCreatedDataTime(),
      soldBy: generateSoldBy(names),
      customer: {},
      channel: getRandomKey("POS", "Online"),
      totals: {
        total,
        subtotal: total,
        discount: 0,
        tax: 0,
      },
      items,
    };
  };
}

export function generateOrders(count, products) {
  return [...generateEntityObjects(count, getOrderEntity(products))];
}
