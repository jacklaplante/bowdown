# Bowdown

## [bowdown.io](https://bowdown.io)

This game is written entirely in [three.js](https://threejs.org/), which is a javascript library for 3D graphics using WebGL. It's an multiplayer game with a client and server. The player downloads the client/webpage to play the game, then connects to the server via websocket. The server keeps track of who is playing, their positions, rotations, actions, etc. and relays all of that information to the clients.

The `client` directory holds all of the client code and assets (sounds/models/images). The `server` directory holds the server script.

To run the game locally:

```
cd server
npm install
npm start
```
in another terminal run
```
cd client
npm install
npm start
```
simple as that.

use `tools/tools.html` to run bots or run the spatial indexer. Select the bot files or gltf/glb file. Indexer can take a very long time to finish. The page can become unresponsive for hours.

and to record a new bot: start recording with 'R', then stop with 'R' again. Then look at the console to copy/paste the bot into a new json file