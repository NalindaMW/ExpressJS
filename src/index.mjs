import express, { request, response } from "express";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (request, response) => {
  response.status(201).send({ msg: "Hello!" });
});

app.get("/api/users", (request, response) => {
  response.send([
    { id: 1, userName: "nalz", displayName: "Nalinda" },
    { id: 2, userName: "john", displayName: "John" },
    { id: 3, userName: "risa", displayName: "Risa" },
  ]);
});

app.get("/api/products", (request, response) => {
  response.send([{ id: 123, name: "chicken breast", price: 12.99 }]);
});

app.listen(PORT, () => {
  console.log(`App running on Port ${PORT}`);
});
