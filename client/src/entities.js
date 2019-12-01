import orc from './orc'

const entities = {
    update: function(states) {
        orc.update(states.orc)
    },
    animate: function(delta) {
        if (orc && orc.mixer) {
            orc.mixer.update(delta);
        }
    }
}

export default entities