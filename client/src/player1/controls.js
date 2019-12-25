import { Vector2, Quaternion, Vector3 } from "three";

import camera from "../camera";
import { shootArrow, retractRopeArrow } from "../arrow/arrow";
import scene from "../scene/scene";

const movementSpeed = 7;
const sprintModifier = 1.3;

function initControls(p1) {
  p1.onMouseDown = function() {
    if (this.activeRopeArrow != null) {
      this.activeRopeArrow = null;
      retractRopeArrow();
      if (this.sounds) {
        this.stopSoundIfPlaying("grappleReel")
      }
    } else if (this.bowState == "unequipped") {
      this.equipBow();
    } else {
      if (this.activeActions.includes("jumping")) {
        this.stopAction("jumping");
      }
      if (this.sounds) {
        this.playSound("bowDraw");
      }
      this.playBowAction("drawBow");
      this.bowState = "drawing";
      setTimeout(function() {
        if (p1.bowState == "drawing") {
          document.getElementById("crosshair").classList.add("aiming");
          p1.bowState = "drawn";
        }
      }, 1000);
      camera.zoomIn();
    }
  };

  p1.onMouseUp = function(event) {
    document.getElementById("crosshair").classList.remove("aiming");
    if (this.sounds) {
      this.stopSoundIfPlaying("bowDraw")
    }
    if (this.bowState == "drawn") {
      this.playBowAction("fireBow");
      if (event.button == 2) {
        this.activeRopeArrow = shootArrow("rope");
        if (this.sounds) {
          this.playSound("grappleShot")
        }
      } else {
        if (this.sounds) {
          this.playSound("bowShot")
        }
        shootArrow("normal");
      }
      this.bowState = "firing";
      camera.zoomOut();
    } else if (this.bowState === "drawing") {
      this.stopAction(this.activeBowAction);
      this.activeBowAction = null;
      this.bowState = "equipped";
      this.idle();
      camera.zoomOut();
    }
  };

  p1.getInputDirection = function(input) {
    var x = 0,
      y = 0; // these are the inputDirections
    if (input.touch.x != 0 && input.touch.y != 0) {
      var dir = new Vector2(input.touch.x, input.touch.y);
      if (dir.length() > 100) {
        input.keyboard.shift = true; // sprinting
      } else {
        input.keyboard.shift = false;
      }
      dir.normalize();
      x = dir.x;
      y = dir.y;
    }
    if (input.keyboard.forward) {
      x += 0;
      y += 1;
    }
    if (input.keyboard.backward) {
      x += 0;
      y += -1;
    }
    if (input.keyboard.left) {
      x += -1;
      y += 0;
    }
    if (input.keyboard.right) {
      x += 1;
      y += 0;
    }
    return new Vector2(x, y);
  };

  p1.getGlobalDirection = function(cameraDirection, inputDirection, input, delta) {
    var up = this.localVector(0, 1, 0);
    return cameraDirection
      .clone()
      .projectOnPlane(up)
      .applyAxisAngle(up, -Math.atan2(inputDirection.x, inputDirection.y))
      .normalize()
      .multiplyScalar(delta * this.runOrSprint(input));
  };

  p1.runOrSprint = function(input) {
    if (input.keyboard.shift) {
      if (this.isRunning()) {
        this.anim[this.activeMovement].timeScale = sprintModifier;
      }
      if (this.godModeOn()) {
        return movementSpeed * sprintModifier * 30;
      }
      return movementSpeed * sprintModifier;
    } else {
      if (this.anim[this.activeMovement]) {
        this.anim[this.activeMovement].timeScale = 1;
      }
      return movementSpeed;
    }
  };

  p1.runningInput = function(input) {
    return (input.touch.x != 0 && input.touch.y != 0) || input.keyboard.forward || input.keyboard.backward || input.keyboard.left || input.keyboard.right;
  };

  p1.getForwardDirection = function(cameraDirection) {
    var direction = cameraDirection.clone();
    if (scene.gravityDirection == "center") {
      direction.applyQuaternion(new Quaternion().setFromUnitVectors(camera.cameraTarget.clone().normalize(), new Vector3(0, 1, 0)));
    }
    return new Vector2(direction.x, direction.z);
  };

  p1.getLocalDirection = function(forwardDirection, inputDirection) {
    if (inputDirection.length() == 0) {
      inputDirection = new Vector2(0, 1);
    }
    return forwardDirection.clone().rotateAround(new Vector2(), Math.atan2(inputDirection.x, inputDirection.y));
  };

  p1.getCameraDirection = function() {
    return camera.getWorldDirection(new Vector3());
  };
}

export default initControls;
