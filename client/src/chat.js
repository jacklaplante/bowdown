export function newChatMessage(message) {
    var textNode = document.createTextNode(message)
    var messageElement = document.createElement("p").appendChild(textNode)
    document.getElementById("chat").appendChild(messageElement)
}