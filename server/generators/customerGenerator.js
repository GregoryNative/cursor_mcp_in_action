import { randomUUID } from "crypto";
import { generateEntityObjects, getRandomIndex } from "./lib.js";

import customers from "../data/customers.json" with { type: "json" };
import images from "../data/avatarFileNames.json" with { type: "json" };

function getRandomImage() {
  return `images/avatars/${images[getRandomIndex(images.length)()]}`;
}

function getCustomerEntity(products) {
  const randomIndex = getRandomIndex(customers.length);
  return {
    id: randomUUID(),
    name: customers[randomIndex()][0],
    lastName: customers[randomIndex()][1],
    email: customers[randomIndex()][2],
    phone: customers[randomIndex()][3],
    avatar: getRandomImage(),
  };
}

export function generateCustomer(count) {
  return [...generateEntityObjects(count, getCustomerEntity)];
}

// const customersCount = 12; //50000;

// const res = generateCustomer(customersCount);

// console.log(res);
