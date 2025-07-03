import path from "path";
import fs from "fs";
import { generateProducts } from "./productListGenerator.js";
import { generateCustomer } from "./customerGenerator.js";
import { generateOrders } from "./orderListGenerator.js";
import { getRandomIndex } from "./lib.js";

const count = {
  products: 10_000,
  orders: 10_000,
  customers: 50,
};

const filePath = path.join("data", "generatedData");

function ordersShortEntity(order) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    created: order.created,
    channel: order.channel,
    total: order.totals.total,
  };
}

function generateData() {
  const products = generateProducts(count.products);
  const orders = generateOrders(count.orders, products);
  const customers = generateCustomer(count.customers);

  orders.forEach((order) => {
    const customerIndex = getRandomIndex(customers.length)();

    order.customer = {
      ...customers[customerIndex],
    };

    customers[customerIndex].orders = [
      ...(customers[customerIndex].orders || []),
      ordersShortEntity(order),
    ];
  });

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
  }

  fs.writeFileSync(
    path.join(filePath, "productList.json"),
    JSON.stringify(products, null, 2),
    "utf8",
  );

  fs.writeFileSync(
    path.join(filePath, "orderList.json"),
    JSON.stringify(orders),
    "utf8",
  );

  fs.writeFileSync(
    path.join(filePath, "customerList.json"),
    JSON.stringify(customers, null, 2),
    "utf8",
  );
}

generateData();
console.log("DONE!");
