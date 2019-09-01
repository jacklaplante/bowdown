// full screen button
var fullScreenButton = document.getElementById("fullscreen");
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
    if (!screen.orientation.type.includes("landscape")) {
        screen.orientation.lock("landscape").catch(function(error) {
            console.log("device orientation cannot be locked to landscape")
        });;
    }
}

var startButton = document.getElementById("start");
startButton.innerText = "LOADING"
import(/* webpackChunkName: "game" */ './game').then(function(module) {
    startButton.innerText = "START"
    startButton.setAttribute("style", "color: #134461; background: #ffdba5; width: 35vw")
    startButton.onclick = function() {
        document.body.removeChild(document.getElementById("menu"))
        module.start();
    }
})
