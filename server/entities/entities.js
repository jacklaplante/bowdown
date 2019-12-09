const orc = require('./orc')
const bird = require('./bird')

const entities = {};

let games, payloads

const updateSpeed = 50 // ms
entities.init = function(g, p, gN) {
    games = g
    payloads = p
    gameName = gN

    orc.init(games, gameName, updateSpeed)
    bird.init()

    setInterval( () => {
        orc.update()
        bird.update()
        entities.updateState()
    }, updateSpeed); // if you change the update interval it must be changed in orc as well
}

entities.updateState = function() {
    if (!payloads[gameName].entities) payloads[gameName].entities = {}
    payloads[gameName].entities.orc = orc.getState()
    payloads[gameName].entities.bird = bird.getState()
    games[gameName].entities.orc = orc.getState()
    games[gameName].entities.bird = bird.getState()
}


module.exports = entities