function killFeed(from, to) {
  let killFeed = document.getElementById("kill-feed")
  let kill = document.createElement("p")
  kill.className = "kill"
  kill.appendChild(document.createTextNode(from + ' killed ' + to))
  killFeed.appendChild(kill)
  setTimeout(_ => {
    killFeed.removeChild(kill)
  }, 8000)
}

export default killFeed