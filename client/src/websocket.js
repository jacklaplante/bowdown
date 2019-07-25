const ws = new WebSocket('ws://localhost:18181');
ws.onopen = function open() {
    sendMessage({message: "sup fucker"})
};

function sendMessage (message) {
    ws.send(JSON.stringify(message))
}

export { ws, sendMessage }