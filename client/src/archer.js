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

function init(mixer, archer) {
    archer.mixer = mixer
    archer.anim = {
        idle: mixer.clipAction(getAnimation(archer.animations, "Idle")),
        running: mixer.clipAction(getAnimation(archer.animations, "Running2")),
        runWithBow: mixer.clipAction(getAnimation(archer.animations, "Run with bow")),
        runWithLegsOnly: mixer.clipAction(getAnimation(archer.animations, "Running legs only")),
        jumping: mixer.clipAction(getAnimation(archer.animations, "Jumping")).setLoop(LoopOnce),
        equipBow: mixer.clipAction(getAnimation(archer.animations, "Equip Bow")).setLoop(LoopOnce),
        drawBow: mixer.clipAction(getAnimation(archer.animations, "Draw bow")).setLoop(LoopOnce),
        fireBow: mixer.clipAction(getAnimation(archer.animations, "Fire bow")).setLoop(LoopOnce)
    }
    archer.anim.drawBow.clampWhenFinished = true

    // BOW STATES:
    // unequipped
    // equipped
    // drawing
    // drawn
    // BOW ACTIONS   |  BOW STATE TRANSITION        |  ANIMATIONS
    //  equip        |   unequipped -> equipped     |   equipBow
    //  draw         |   equipped -> drawing        |   drawBow
    //  completeDraw |   drawing -> drawn           |
    //  cancelDraw   |   drawing/drawn -> equipped  |
    //  fire         |   drawn -> equipped          |   fireBow


    archer.toggleBow = function(bool) { // bool == true means equipBow (bow in hand)
        // this is a hack because I'm too lazy to figure out how to animate this in blender
        archer.scene.children[0].children[1].visible = !bool
        archer.scene.children[0].children[2].visible = bool
    }

    archer.bowAction = function(bowState) {
        if (archer.bowState != bowState) {

            // player.anim[bowAction].reset().play();
        }
    }

    archer.movementAction = function(action="idle") {
        if (archer.anim && archer.anim[action]) {
            if (archer.activeMovement) {
                if (archer.activeMovement != action) {
                    archer.anim[archer.activeMovement].stop()
                } else  {
                    return
                }
            }
            archer.anim[action].reset().play();
            archer.activeMovement = action
        } else {
            console.error("action: " + action + " does not exist!");
        }
    }

    archer.isRunning = function() {
        if (archer.activeMovement) {
            return archer.activeMovement.toLowerCase().includes("run")
        }
        return false
    }

    archer.isFiring = function() {
        return (archer.bowState && (archer.bowState == "drawn" || archer.bowState == "drawing" || archer.bowState == "firing"))
    }
}

export {init}