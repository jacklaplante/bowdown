# [Bowdown.io](https://bowdown.io)

This game is written entirely in [three.js](https://threejs.org/), which is a javascript library for 3D graphics using WebGL. It's a multiplayer game with a client and server. The player downloads the client/webpage to play the game, then connects to the server via websocket. The server keeps track of who is playing, their positions, rotations, actions, etc. and relays all of that information to the clients.

The `client` directory holds all of the client code and assets (sounds/models/images). The `server` directory holds the server script.

To run the game locally clone this repo, then:

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

## Client
The majority of the code is in here.

Everything that pertains to controlling the main character, movement, and physics is in `player1.js`.

Everything that is common between the main player character and the other players is taken care of in `archer.js` (player noises, model, actions, etc.)

All functionality that is specific to other players is found in `players.js`. The client receives info about other player's movement and actions 10 times per second (more about that below). So, in between the updates I estimate the other player's position by applying their velocity to their position. This is called interpolation and is a common technique in multiplayer games to prevent choppy movement. I do this for the birds as well in `birds.js`.

### Collision Detection
I use [RayCasters](https://threejs.org/docs/#api/en/core/Raycaster) to detect collisions. This is probably not the most efficient way. I make it more efficient by creating a `spatialIndex` of the world. Which just means I divide the world into 'chunks' and only detect collisions against objects that are in the player's immediate 'chunk'. If the `spatialIndex` is present, `getCollidableEnvironment` in `scene.js` will return the collidable 'chunk' from the `spatialIndex`. Otherwise the entire `collidableEnvironment` will be returned. I wrote a super hacky tool that creates the spatial index, it can be found in `tools/tools.html` (as well as a bot tool that might not work anymore). This tool will take several hours to create the index so I try and do it while I sleep.

### Third person camera
`camera.js` also handles the third person camera logic. There's plenty of extra voodoo that goes into making the player and camera rotate around the planet (as of Jan 2020 this is still buggy).

### Connection
`websocket.js` handles all of the client communication with the server. The player's state is broadcasted to the server every single frame.

### Lazy loading
This project uses Webpack. I try and take advantage of lazy-loading as much as possible because a lot of the game's assets are huge! That's why you'll notice you spawn in a lobby area. This is the player can get a chance to mess around with the controls while the model for the main world is downloaded.

## Server
The server keeps track of the game(s) state (player's states and entity (birds) states). I send the game state to each player 10 times per second. This state is pretty big and it takes a long time to send all of the players. So I send the player the entire state of the game when they connect to the server. Then after that I keep track of what has changed in the game state and send that to the players, instead of the entire state.

This server currently (as of January 2020) does very little to prevent cheating. Most competitive multiplayer games will handle more of the game logic on the server to prevent cheating. The game relies entirely on the client to detect when players have been hit by arrows, take damage, etc. which makes the game very vulnerable to cheating. three.js isn't built for server side rendering and I didn't know how else to render the game world on the server side and apply game logic to it. This is also why you'll notice I have `orc.js` that was never actually added to the game.