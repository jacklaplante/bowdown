const fs = require('fs');
const WebSocket = require('ws');

if (process.argv.length < 3) throw "must specify which bot in tools/bots/ to run"

const serverAddress = 'ws://localhost:18181'
const ws = new WebSocket(serverAddress);

var botFiles
if (process.argv[2] == "all") {
  botFiles = fs.readdirSync("bots")
  for (var i=0; i< botFiles.length; i++) {
    botFiles[i] = "bots/" + botFiles[i]
  }
} else {
  botFiles = process.argv.slice(2, process.argv.length) 
}
var bots = []
botFiles.forEach((file) => {
  if (!fs.existsSync(file)) throw "bot file " + file + " does not exist!"
  bots.push(JSON.parse(fs.readFileSync(file)))
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runBot(actions) {
  console.log("running bot")
  var action
  for (let i = 0; i < actions.length; i++) {
    action = actions[i]
    await sleep(action.elapsedTime * 1000)
    ws.send(JSON.stringify(action.message))
    if (i == actions.length-1) i = 0 // loop forever
  }
}

ws.on('open', async function(wss) {
  bots.forEach((bot) => runBot(bot))
})