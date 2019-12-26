import {loadAudio, loadAllAudio} from '../audio'

import arrowHitGroundAudio from '../../audio/effects/Arrow to Ground.mp3'
import arrowHitPlayerAudio from '../../audio/effects/Arrow to Player.mp3'
import grappleHitAudio from '../../audio/effects/Grapple Hit.mp3'

function initAudio(arrow) {
    if (arrow.type == "rope") {
        let grappleHit = loadAudio(grappleHitAudio)
        arrow.add(grappleHit)
        arrow.hitSound = grappleHit
    } else {
        let hitGround = loadAudio(arrowHitGroundAudio)
        arrow.add(hitGround)
        arrow.hitSound = hitGround
    }
    let hitPlayer = loadAudio(arrowHitPlayerAudio)
    arrow.add(hitPlayer)
    arrow.hitPlayerSound = hitPlayer
}

export default initAudio