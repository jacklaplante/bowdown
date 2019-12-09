import orc from './orc'
import bird from './bird'

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
        if (states.bird) {
            if (!roster.bird) {
                bird.add(states.bird)
            } else {
                bird.update(states.bird)
            }
            roster.bird = states.bird
        }
    },
    animate: function(delta) {
        if (orc && orc.mixer) {
            orc.animate(delta)
        }
        if (bird && bird.mixer) {
            bird.animate(delta)
        }
    }
}

export default entities