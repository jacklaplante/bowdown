import { sendMessage } from "../websocket";

function initActions(p1) {
  p1.playAction = function(action) {
    if (this.anim[action]) {
      this.anim[action].reset().play();
      sendMessage({
        player: this.uuid,
        playAction: action
      });
      if (!this.activeActions.includes(action)) {
        this.activeActions.push(action);
      }
    }
  };

  p1.stopAction = function(action) {
    if (this.activeActions.includes(action)) {
      this.activeActions = this.activeActions.filter(e => e != action);
      this.anim[action].stop();
      sendMessage({
        player: this.uuid,
        stopAction: action
      });
    } else {
      console.error("tried to stop action: " + action + ", but action was never started");
    }
  };

  p1.bowAction = function(bowAction) {
    if (this.anim && this.anim[bowAction]) {
      if (this.activeBowAction != bowAction) {
        if (this.activeBowAction) {
          this.stopAction(this.activeBowAction);
          this.activeBowAction = null;
        }
        if (this.activeMovement && this.activeMovement != "runWithLegsOnly") {
          this.stopAction(this.activeMovement);
        }
        if (bowAction) {
          this.playAction(bowAction);
        }
        this.activeBowAction = bowAction;
      }
    } else {
      console.error("action: " + bowAction + " does not exist!");
    }
  };

  p1.movementAction = function(action = "idle") {
    if (this.anim && this.anim[action]) {
      if (this.activeMovement) {
        if (this.activeMovement != action) {
          this.stopAction(this.activeMovement);
        } else {
          return;
        }
      }
      this.playAction(action);
      this.activeMovement = action;
    } else {
      console.error("action: " + action + " does not exist!");
    }
  };
}

export default initActions;
