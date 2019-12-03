import orc from './orc'

const roster = {}

const entities = {
    update: function(states) {
        if (states.orc) {
            if (!roster.orc) {
                orc.add(states.orc)
            } else {
                orc.update(states.orc)
            }
            roster.orc = states.orc
        }
    },
    animate: function(delta) {
        if (orc && orc.mixer) {
            orc.mixer.update(delta);
        }
    }
}

export default entities