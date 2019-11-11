# bowdown

[bowdown.io](https://bowdown.io)


you might need this when changing react components in client/src/components (run in `client`)

```
npx babel --watch src/components --out-dir components/ --presets react-app/prod
```

use `tools/tools.html` to run bots or run the spatial indexer. Select the bot files or gltf/glb file. Indexer can take a very long time to finish. The page can become unresponsive for hours.

and to record a new bot: start recording with 'R', then stop with 'R' again. Then look at the console to copy/paste the bot into a new json file

to run the production server (run in `server`)
```
nohup node server.js prod [SERVER NAME] [PUBLIC SERVER IP] [API KEY] > output.log & disown
```