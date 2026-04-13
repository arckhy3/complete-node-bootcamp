const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  //using streams to read and send the file
  const readable = fs.createReadStream("test-file.txt");
  // currently the file is being read in chunks and sent to the client, but we can also use the pipe method to do this in a more efficient way
  //   readable.on("data", (chunk) => {
  //     res.write(chunk);
  //   });

  //   readable.on("end", () => {
  //     res.end();
  //   });

  readable.pipe(res);
});

server.listen(8000);
