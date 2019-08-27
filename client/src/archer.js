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

function initActions(mixer, archer) {
    archer.mixer = mixer
    archer.actions = {
        idle: mixer.clipAction(getAnimation(archer.animations, "Idle")),
        running: mixer.clipAction(getAnimation(archer.animations, "Running2")),
        runWithBow: mixer.clipAction(getAnimation(archer.animations, "Run with bow")),
        runWithLegsOnly: mixer.clipAction(getAnimation(archer.animations, "Running legs only")),
        jumping: mixer.clipAction(getAnimation(archer.animations, "Jumping")).setLoop(LoopOnce),
        equipBow: mixer.clipAction(getAnimation(archer.animations, "Equip Bow")).setLoop(LoopOnce),
        drawBow: mixer.clipAction(getAnimation(archer.animations, "Draw bow")).setLoop(LoopOnce),
        fireBow: mixer.clipAction(getAnimation(archer.animations, "Fire bow")).setLoop(LoopOnce)
    }
    archer.actions.drawBow.clampWhenFinished = true

    archer.toggleBow = function(bool) { // bool == true means equipBow (bow in hand)
        // this is a hack because I'm too lazy to figure out how to animate this in blender
        archer.scene.children[0].children[1].visible = !bool
        archer.scene.children[0].children[2].visible = bool
    }
}

function archerAction(player, action="idle") {
    if (player.actions && player.actions[action]) {
        if (player.activeAction) {
            if (player.activeAction != action) {
                player.actions[player.activeAction].stop()
            } else  {
                return
            }
        }
        player.actions[action].reset().play();
    } else {
        console.error("action: " + action + " does not exist!");
    }
}

export {initActions, archerAction}