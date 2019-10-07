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

import(/* webpackChunkName: "game" */ './game').then(function(module) {
    document.body.classList.remove("loading")
    document.body.classList.add("ready")
    document.getElementById("start").onclick = function() {
        if (typeof document.body.requestPointerLock == "function") {
            document.body.requestPointerLock();
        }
        document.getElementsByTagName("audio")[0].pause()
        module.start();
    }
})

var song
import('../audio/Menu_Theme.mp3').then(function(song) {
    song = new Audio(song.default);
    song.addEventListener("load", function() {
        song.play();
    }, true);
    song.autoplay=true
    song.loop=true
    document.body.appendChild(song)
    song.load()
})
