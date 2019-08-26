const body = document.getElementsByTagName("BODY")[0];

var startButton = document.createElement("div");
startButton.setAttribute("style", "height: 100px; width: 100px; position: fixed; color: aquamarine; font-size: 30pt;")
startButton.innerText = "LOADING"
body.appendChild(startButton)
import(/* webpackChunkName: "game" */ './game').then(function(module) {
    startButton.innerText = "START"
    startButton.onclick = function() {
        body.removeChild(startButton)
        module.start(body);
    }
})
