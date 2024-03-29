import express, { request, response } from "express";

const app = express();

// Registering the JSON middleware for POST requests
app.use(express.json());

// Middleware function is also a request handler which have access to (request, response, next)
// Can use globally or only for specific endpoints
// Can have multiple middlewares for same endpoint
const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
  next();
};

const resolveIndexByUserId = (request, response, next) => {
  const {
    params: { id },
  } = request;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);

  // Passing findUserIndex back to the function by assining to the new request property
  request.findUserIndex = findUserIndex;
  next();
};

// Using the loggingMiddleware globally
app.use(loggingMiddleware);

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

// app.get("/", (request, response) => {
//   response.status(201).send({ msg: "Hello!" });
// });

// Root endpoint with multiple middlewares
app.get(
  "/",
  (request, response, next) => {
    console.log("Base URL 1");
    next();
  },
  (request, response, next) => {
    console.log("Base URL 2");
    next();
  },
  (request, response) => {
    response.status(201).send({ msg: "Hello!" });
  }
);

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

// Post Requests
app.post("/api/users", (request, response) => {
  console.log(request.body);

  const { body } = request;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
  mockUsers.push(newUser);

  return response.status(201).send(newUser);
});

// PUT Requests
// Updating the entire record
// Without a middleware function
/*
app.put("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) return response.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return response.sendStatus(404);

  mockUsers[findUserIndex] = { id: parsedId, ...body };
  return response.sendStatus(200);
});
*/

// With the use of resolveIndexByUserId middleware function
app.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

// PATCH Requests
// Updating only a portion of the user record
app.patch("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) return response.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return response.sendStatus(404);

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`App running on Port ${PORT}`);
});

// DELETE Requests
// Deleting the entire record
app.delete("/api/users/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) return response.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return response.sendStatus(404);
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});
