const orc = require('./orc')

const entities = {};

let games, payloads

const updateSpeed = 50 // ms
entities.init = function(g, p, gN) {
    games = g
    payloads = p
    gameName = gN

    orc.init(games, gameName, updateSpeed)

    setInterval( () => {
        orc.update()
        entities.updateState()
    }, updateSpeed); // if you change the update interval it must be changed in orc as well
}

entities.updateState = function() {
    if (!payloads[gameName].entities) payloads[gameName].entities = {}
    payloads[gameName].entities.orc = {
        position: orc.position,
        velocity: orc.velocity,
        rotation: orc.rotation
    }
    games[gameName].entities.orc = {
        position: orc.position,
        velocity: orc.velocity,
        rotation: orc.rotation
    }
}


module.exports = entities