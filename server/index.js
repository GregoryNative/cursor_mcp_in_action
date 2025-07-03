import path from "path";
import fs from "fs";
import express from "express";

const app = express();
const port = 3000;

// Cache for storing file contents
const fileCache = new Map();

function readJsonFile(filePath, callback) {
  const absolutePath = path.resolve(filePath);

  // Check if data is in cache
  if (fileCache.has(absolutePath)) {
    return callback(null,fileCache.get(absolutePath));
  }

  fs.readFile(absolutePath, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        console.log("File not found, returning null.");
        return callback(null, null);
      }
      return callback(err);
    }

    try {
      const parsedData = JSON.parse(data);
      // Store in cache
      fileCache.set(absolutePath, parsedData);
      callback(null, parsedData);
    } catch (parseErr) {
      callback(parseErr);
    }
  });
}

function limitResult(req, entries) {
  const limit = +req.query.limit || entries.length;
  const offset = +req.query.offset || 0;
  return entries.slice(offset, offset + limit);
}

app.use(express.static("public"));

app.get("/products", (req, res) => {
  readJsonFile("./data/generatedData/productList.json", (err, products) => {
    console.log(`/GET products - query: ${JSON.stringify(req.query, null, 2)}`)
    if (err) throw err;
    res.json(limitResult(req, products));
  });
});

app.get("/orders", (req, res) => {
  readJsonFile("./data/generatedData/orderList.json", (err, products) => {
    console.log(`/GET orders - query: ${JSON.stringify(req.query, null, 2)}`)
    if (err) throw err;
    res.json(limitResult(req, products));
  });
});

app.get("/customers", (req, res) => {
  readJsonFile("./data/generatedData/customerList.json", (err, products) => {
    console.log(`/GET customers - query: ${JSON.stringify(req.query, null, 2)}`)
    if (err) throw err;
    res.json(limitResult(req, products));
  });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
