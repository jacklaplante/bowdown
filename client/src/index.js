import {start} from './game'

const body = document.getElementsByTagName("BODY")[0];

var startButton = document.createElement("div");
startButton.setAttribute("style", "height: 100px; width: 100px; position: fixed; color: aquamarine; font-size: 30pt;")
startButton.innerText = "START"
startButton.onclick = function() {
    start(body)
    body.removeChild(startButton)
}
body.appendChild(startButton)
