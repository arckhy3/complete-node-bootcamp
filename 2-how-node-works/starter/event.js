const EventEmmiter = require("events");
const http = require("http");

const myEmmiter = new EventEmmiter();

myEmmiter.on("response", (name, id) => {
  console.log(`Data received from ${name} with id: ${id}`);
});

myEmmiter.on("response", () => {
  console.log(`Some other logic here`);
});

myEmmiter.emit("response", "John", 34);

class Sales extends EventEmmiter {
  constructor() {
    super();
  }
}

const mySales = new Sales();

mySales.on("newSale", () => {
  console.log("There was a new sale");
});

mySales.on("newSale", () => {
  console.log("Customer name: John");
});

mySales.emit("newSale");

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request received");
  res.end("Request received");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is listening on port 8000");
});
