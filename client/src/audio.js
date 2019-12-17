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

function loadAllAudio(files) {
    let audio = []
    files.keys().forEach((file) => {
        audio.push(loadAudio(files(file)))
    });
    return audio
}

function addAudio(object3d, audio) { // recursive
    Object.keys(audio).forEach((sound) => {
        sound = audio[sound]
        if (sound.length) {
            addAudio(object3d, sound)
        } else {
            object3d.add(sound)
        }
    })
}

export {loadAudio, loadAllAudio, addAudio}