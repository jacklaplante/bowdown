var startButton = document.getElementById("start");
startButton.innerText = "LOADING"
import(/* webpackChunkName: "game" */ './game').then(function(module) {
    startButton.innerText = "START"
    startButton.onclick = function() {
        document.body.removeChild(document.getElementById("menu"))
        module.start();
    }
})
