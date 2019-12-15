import {LoopOnce} from 'three'

import {getAnimation} from './utils'

function init(mixer, archer) {
    archer.mixer = mixer
    archer.anim = {
        idle: mixer.clipAction(getAnimation(archer.gltf, "Idle")),
        running: mixer.clipAction(getAnimation(archer.gltf, "Running best")),
        runWithBow: mixer.clipAction(getAnimation(archer.gltf, "Running with bow best")),
        runWithLegsOnly: mixer.clipAction(getAnimation(archer.gltf, "Running legs only")),
        jumping: mixer.clipAction(getAnimation(archer.gltf, "Jumping2")).setLoop(LoopOnce),
        equipBow: mixer.clipAction(getAnimation(archer.gltf, "Equip Bow")).setLoop(LoopOnce),
        drawBow: mixer.clipAction(getAnimation(archer.gltf, "Draw bow")).setLoop(LoopOnce),
        fireBow: mixer.clipAction(getAnimation(archer.gltf, "Fire bow")).setLoop(LoopOnce),
        death: mixer.clipAction(getAnimation(archer.gltf, "death")).setLoop(LoopOnce)
    }
    archer.anim.drawBow.clampWhenFinished = true

    mixer.addEventListener('finished', (event) => {
        if (event.action.getClip().name == "death" && archer.hp <= 0) {
            archer.gltf.scene.visible = false
        }
    })

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

    archer.isRunning = function() {
        if (archer.activeMovement) {
            return archer.activeMovement.toLowerCase().includes("run")
        }
        return false
    }

    archer.isFiring = function() {
        return (archer.bowState && (archer.bowState == "drawn" || archer.bowState == "drawing" || archer.bowState == "firing"))
    }

    archer.getPosition = function() {
        if (archer.gltf) {
            return archer.gltf.scene.position.clone()
        }
        console.error("archer.gltf has not been defined yet")
    }

    archer.setPosition = function(newPos) {
        if (archer.gltf != null) {
            archer.gltf.scene.position.copy(newPos)
        } else {
            console.error("archer.gltf has not been defined yet")   
        }
    }

    archer.addVelocity = function(vect) {
        this.setVelocity(this.getVelocity().add(vect))
    }

    archer.getVelocity = function() {
        if (archer.velocity) {
            return archer.velocity.clone()
        }
        console.warn("archer.getVelocity() was called but aracher.velocity is null")
    }

    archer.setVelocity = function(velocity) {
        archer.velocity = velocity
    }

    archer.getRotation = function() {
        if (archer.gltf) {
            return archer.gltf.scene.rotation
        }
        console.error("archer.gltf has not been defined yet")
    }

    archer.globalVector = function(localVector) {
        return localVector.clone().applyEuler(this.getRotation());
    }
}

export {init}