// full screen button
var fullScreenButton = document.getElementById("fullscreen");
if (document.body.requestFullscreen || document.body.mozRequestFullScreen || document.body.webkitRequestFullscreen || document.body.msRequestFullscreen) {
    fullScreenButton.setAttribute("style", "display: block")
    fullScreenButton.onclick = function() {
        if (document.body.requestFullscreen) {
            document.body.requestFullscreen();
        } else if (document.body.mozRequestFullScreen) { /* Firefox */
            document.body.mozRequestFullScreen();
        } else if (document.body.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            document.body.webkitRequestFullscreen();
        } else if (document.body.msRequestFullscreen) { /* IE/Edge */
            document.body.msRequestFullscreen();
        }
        if (screen.orientation.type && !screen.orientation.type.includes("landscape")) {
            screen.orientation.lock("landscape").catch(function(error) {
                console.log("device orientation cannot be locked to landscape")
            });;
        }
    }
}

var startGameButton = document.getElementById("loading-game");

import(
    /* webpackMode: "lazy" */
    /* webpackChunkName: "game" */ './game').then((game) => {
        startGameButton.innerText = "Start"
        startGameButton.onclick = function() {
            game.start()
        }
  let root = document.body
  root.classList.remove("loading")
  root.classList.add("ready")
})