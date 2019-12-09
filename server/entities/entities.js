const orc = require('./orc')
const birds = require('./birds')

const entities = {};

let games, payloads

const updateSpeed = 50 // ms
entities.init = function(g, p, gN) {
    games = g
    payloads = p
    gameName = gN

    orc.init(games, gameName, updateSpeed)

    for (var i=0; i<100; i++) {
        birds.init()
    }

    setInterval( () => {
        orc.update()
        birds.updateAll()
        entities.updateState()
    }, updateSpeed); // if you change the update interval it must be changed in orc as well
}

entities.updateState = function() {
    if (!payloads[gameName].entities) payloads[gameName].entities = {}
    payloads[gameName].entities.orc = orc.getState()
    payloads[gameName].entities.birds = birds.getState()
    games[gameName].entities.orc = orc.getState()
    games[gameName].entities.birds = birds.getState()
}


module.exports = entities