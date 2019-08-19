import {LoopOnce} from 'three'

function getAnimation(animations, name){
    var result;
    animations.forEach((animation) => {
        if (animation.name===name) {
            result = animation
            return
        }
    })
    return result
}

export function init(mixer, archer) {
    archer.actions = {
        idle: mixer.clipAction(getAnimation(archer.animations, "Idle")),
        running: mixer.clipAction(getAnimation(archer.animations, "Running2")),
        jumping: mixer.clipAction(getAnimation(archer.animations, "Jumping")).setLoop(LoopOnce),
        runWithBow: mixer.clipAction(getAnimation(archer.animations, "Run with bow")),
        equipBow: mixer.clipAction(getAnimation(archer.animations, "Equip Bow")).setLoop(LoopOnce),
        drawBow: mixer.clipAction(getAnimation(archer.animations, "Draw bow")).setLoop(LoopOnce),
        fireBow: mixer.clipAction(getAnimation(archer.animations, "Fire bow")).setLoop(LoopOnce)
    }
}