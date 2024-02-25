import express, { request, response } from "express";

const app = express();

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, userName: "nalz", displayName: "Nalinda" },
  { id: 2, userName: "john", displayName: "John" },
  { id: 3, userName: "risa", displayName: "Risa" },
  { id: 4, userName: "adam", displayName: "Adam" },
  { id: 5, userName: "tima", displayName: "Tima" },
  { id: 6, userName: "jason", displayName: "Jason" },
  { id: 7, userName: "marlan", displayName: "Marlan" },
];

app.get("/", (request, response) => {
  response.status(201).send({ msg: "Hello!" });
});

app.get("/api/users", (request, response) => {
  response.send(mockUsers);
});

//Route Params
//Ex: -> /api/users/1
app.get("/api/users/:id", (request, response) => {
  console.log(request.params);
  const parsedId = parseInt(request.params.id);

  if (isNaN(parsedId))
    return response.status(400).send({ msg: "Bad Request. Invalid ID." });

  const findUser = mockUsers.find((user) => user.id == parsedId);
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

app.get("/api/products", (request, response) => {
  response.send([{ id: 123, name: "chicken breast", price: 12.99 }]);
});

app.listen(PORT, () => {
  console.log(`App running on Port ${PORT}`);
});
