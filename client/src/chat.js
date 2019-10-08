export function newChatMessage(message) {
    var textNode = document.createTextNode(message)
    var messageElement = document.createElement("p")
    messageElement.className = "message"
    messageElement.appendChild(textNode)
    document.getElementById("chat").appendChild(messageElement)
}