# Bowdown

## [bowdown.io](https://bowdown.io)

This game is written entirely in [three.js](https://threejs.org/), which is a javascript library for 3D graphics using WebGL. It's an multiplayer game with a client and server. The player downloads the client/webpage to play the game, then connects to the server via websocket. The server keeps track of who is playing, their positions, rotations, actions, etc. and relays all of that information to the clients.

The `client` directory holds all of the client code and assets (sounds/models/images). The `server` directory holds the server script.

## Client
The majority of the code is in here. the important stuff is in the `player1` directory. Everything that pertains to controlling the main character is in there. `camera.js` also handles the third person camera logic. There's plenty of extra voodoo that goes into making the player and camera rotate around the planet (as of Jan 2020 this is still buggy). `websocket.js` handles all of the client communication with the server. The player's state is broadcasted to the server every single frame.

This project uses Webpack. I try and take advantage of lazy-loading as much as possible because a lot of the game's assets are huge! That's why you'll notice you spawn in a lobby area. This is the player can get a chance to mess around with the controls while the model for the main world is downloaded.

## Server
The server keeps track of the game(s) state (player's states and entity (birds) states). This state is pretty big and it takes to long to send all of the players the entire game state multiple times a second. So instead I only keep track of what has changed in the game state (the `payload`) and send that to the players (20 times per second).
There are some messages that just get broadcasted to all players immediately, instead of being added to the payload. These include chat, respawn, sounds, and actions.

### To run the game locally:

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