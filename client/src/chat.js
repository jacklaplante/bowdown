export function newChatMessage(message, playerName) {
    if (playerName && typeof playerName == "string") {
        message = playerName + " - " + message
    }
    var textNode = document.createTextNode(message)
    var messageElement = document.createElement("p")
    messageElement.className = "message"
    messageElement.appendChild(textNode)
    document.getElementById("chat").appendChild(messageElement)
}