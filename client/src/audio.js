import {AudioLoader, PositionalAudio} from 'three';

import {camera} from './camera';

var audioLoader = new AudioLoader();

function loadAudio(file) {
    var sound = new PositionalAudio(camera.listener);
    audioLoader.load(file, function(buffer) {
        sound.setBuffer(buffer);
        sound.setRefDistance(5);
    })
    return sound
}

export {loadAudio}