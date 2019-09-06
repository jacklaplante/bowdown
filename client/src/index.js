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

import(/* webpackChunkName: "game" */ './game').then(function(module) {
    document.body.classList.remove("loading")
    document.body.classList.add("ready")
    document.getElementById("start").onclick = function() {
        if (document.body.requestPointerLock) {
            document.body.requestPointerLock();
        }
        module.start();
    }
})
