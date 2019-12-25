import { loadAudio, loadAllAudio, addAudio } from "../audio";
import { getRandom } from "../utils"

import audioBowShot from "../../audio/effects/Bow Shot.mp3";
import audioBowDraw from "../../audio/effects/Bow Draw.mp3";
import audioGrappleShot from "../../audio/effects/Grapple Shot.mp3";
import audioGrappleReel from "../../audio/effects/Grapple Reel Loop.mp3";

const footsteps = require.context("../../audio/effects/footsteps");

function initAudio(archer) {
  archer.sounds = {
    bowShot: loadAudio(audioBowShot),
    bowDraw: loadAudio(audioBowDraw),
    grappleShot: loadAudio(audioGrappleShot),
    grappleReel: loadAudio(audioGrappleReel),
    footsteps: loadAllAudio(footsteps)
  }
  addAudio(archer.gltf.scene, archer.sounds);

  archer.playSound = function(sound) {
    if (sound == "footsteps") {
      this.playFootstepSound()
    } else if (sound == "grappleReel") {
      this.playSoundIfNotPlaying("grappleReel")
    } else {
      this.sounds[sound].play();
    }
  }

  archer.stopSoundIfPlaying = function(sound) {
    if (this.sounds[sound].isPlaying) {
      this.sounds[sound].stop()
    }
  }

  archer.playSoundIfNotPlaying = function(sound) {
    if (!this.sounds[sound].isPlaying) {
      this.sounds[sound].play();
    }
  }

  archer.playFootstepSound = function() {
    setTimeout(() => {
      if (this.isRunning()) {
        let sound = getRandom(this.sounds.footsteps);
        sound.play();
        this.playFootstepSound();
      }
    }, 400);
  };
}

export default initAudio