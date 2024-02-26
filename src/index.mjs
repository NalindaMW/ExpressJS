import express, { request, response } from "express";

const app = express();

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "nalz", displayName: "Nalinda" },
  { id: 2, username: "john", displayName: "John" },
  { id: 3, username: "risa", displayName: "Risa" },
  { id: 4, username: "adam", displayName: "Adam" },
  { id: 5, username: "tima", displayName: "Tima" },
  { id: 6, username: "jason", displayName: "Jason" },
  { id: 7, username: "marlan", displayName: "Marlan" },
];

app.get("/", (request, response) => {
  response.status(201).send({ msg: "Hello!" });
});

//get route without route or query params
/*
app.get("/api/users", (request, response) => {
  response.send(mockUsers);
});
*/

//Query Params
//Ex: -> /api/users?filter=username&value=nalz
app.get("/api/users", (request, response) => {
  console.log(request.query);
  const { filter, value } = request.query;

  // When both filter and value are present
  if (filter && value) {
    return response.send(
      mockUsers.filter((user) => user[filter].includes(value))
    );
  }

  return response.send(mockUsers);
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
