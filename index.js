// Built my own Redis Guide
// 1) What is redis
// 2) TCP Protocol
// 3) Redis Serialization Protocol
// 4) Building the RESP Server
// 5) Handling GET,SET,PING Commands

const net = require("net");
const Parser = require("redis-parser");
const store = {};
const server = net.createServer((connection) => {
  console.log("Client connected....");
  connection.on("data", (data) => {
    const parser = new Parser({
      returnReply: (reply) => {
        const command = reply[0];
        switch (command) {
          case "set":
            {
              const key = reply[1];
              const value = reply[2];
              // because redi is key value pair
              store[key] = value;
              connection.write("+OK\r\n");
            }
            break;
          case "get": {
            const key = reply[1];
            const value = store[key];
            if (!value) {
              connection.write("$-1\r\n");
            } else {
              connection.write(`$${value.length}\r\n${value}\r\n`);
            }
          }
        }
      },
      returnError: (err) => {
        console.log("=>", err);
      },
    });
    parser.execute(data);
  });
});

server.listen(8000, () => {
  console.log("Custom redis server running on Port 8000");
});
