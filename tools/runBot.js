const fs = require('fs');
const WebSocket = require('ws');

if (process.argv.length < 3) throw "must specify which bot in tools/bots/ to run"
if (!fs.existsSync(process.argv[2])) throw "bot " + process.argv[2] + " does not exist!"

const serverAddress = 'ws://localhost:18181'
const ws = new WebSocket(serverAddress);

var actions = JSON.parse(fs.readFileSync(process.argv[2]));

ws.on('open', (wss) => {
  actions.forEach(action => {
    setTimeout(() => {
      if (action) {
        action = JSON.stringify(action)
        ws.send(action)
      }
    }, 100)
  });
})

console.log("attempting to run bot: " + process.argv[2]);