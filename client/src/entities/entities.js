import orc from './orc'
import birds from './birds'
import {eachDo} from '../utils'

const roster = {} // remove this when you update orc

const entities = {
    update: function(state) {
        if (state.orc) {
            if (!roster.orc) {
                orc.add(state.orc)
            } else {
                orc.update(state.orc)
            }
            roster.orc = state.orc
        }
        if (state.birds) {
            eachDo(state.birds, (birdUuid) => {
                let birdState = state.birds[birdUuid]
                if (!birds.get(birdUuid)) {
                    birds.add(birdUuid, birdState)
                } else if (birds.get(birdUuid).update) {
                    birds.get(birdUuid).update(birdState)
                }
            })
        }
    },
    animate: function(delta) {
        if (orc && orc.mixer) {
            orc.animate(delta)
        }
        birds.animate(delta)
    }
}

export default entities