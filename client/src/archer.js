import {LoopOnce} from 'three'

function getAnimation(archer, name){
    var result;
    archer.gltf.animations.forEach((animation) => {
        if (animation.name===name) {
            result = animation
            return
        }
    })
    if (result == null) {
        console.error("animation: "+name+" cannot be found!")
    }
    return result
}

function init(mixer, archer) {
    archer.mixer = mixer
    archer.anim = {
        idle: mixer.clipAction(getAnimation(archer, "Idle")),
        running: mixer.clipAction(getAnimation(archer, "Running best")),
        runWithBow: mixer.clipAction(getAnimation(archer, "Running with bow best")),
        runWithLegsOnly: mixer.clipAction(getAnimation(archer, "Running legs only")),
        jumping: mixer.clipAction(getAnimation(archer, "Jumping")).setLoop(LoopOnce),
        equipBow: mixer.clipAction(getAnimation(archer, "Equip Bow")).setLoop(LoopOnce),
        drawBow: mixer.clipAction(getAnimation(archer, "Draw bow")).setLoop(LoopOnce),
        fireBow: mixer.clipAction(getAnimation(archer, "Fire bow")).setLoop(LoopOnce)
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
    //  completeDraw |   drawing -> drawn           |   _default
    //  cancelDraw   |   drawing/drawn -> equipped  |   _default
    //  fire         |   drawn -> equipped          |   fireBow


    archer.toggleBow = function(bool) { // bool == true means equipBow (bow in hand)
        // this is a hack because I'm too lazy to figure out how to animate this in blender
        archer.gltf.scene.children[0].children[1].visible = !bool
        archer.gltf.scene.children[0].children[2].visible = bool
    }

    archer.bowAction = function(bowAction) {
        if (archer.anim && archer.anim[bowAction]){
            if (archer.activeBowAction != bowAction) {
                if (archer.activeBowAction) {
                    archer.anim[archer.activeBowAction].stop()
                }
                if (archer.activeMovement && archer.activeMovement != "runWithLegsOnly") {
                    archer.anim[archer.activeMovement].stop()
                }
                if (bowAction) {
                    archer.anim[bowAction].reset().play();
                }
                archer.activeBowAction = bowAction
            }
        } else {
            console.error("action: " + bowAction + " does not exist!");
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