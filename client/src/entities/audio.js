import {loadAudio} from '../audio'

import squawkSound from '../../audio/effects/squawk.mp3'

function initAudio(bird) {
  if (!bird.sounds) {
    bird.sounds = {
      squawk: loadAudio(squawkSound)
    }
  }
}

export default initAudio