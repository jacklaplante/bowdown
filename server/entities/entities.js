const orc = require('./orc')

const entities = {};

let games, payloads

entities.init = function(g, p, gN) {
    games = g
    payloads = p
    gameName = gN

    setInterval( () => {
        orc.update(games, gameName)
        entities.updateState()
    }, 50); // if you change the update interval it must be changed in orc as well
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