# bowdown

[bowdown.io](https://bowdown.io)



use `tools/tools.html` to run bots or run the spatial indexer. Select the bot files or gltf/glb file. Indexer can take a very long time to finish. The page can become unresponsive for hours.

and to record a new bot: start recording with 'R', then stop with 'R' again. Then look at the console to copy/paste the bot into a new json file

to run the production server (run in `server`)
```
nohup node server.js prod [SERVER NAME] [PUBLIC SERVER IP] [API KEY] > output.log & disown
```

DOCKER:
to build the image:
```
docker build -t bowdown-server:<tag name>  .
docker run 
```

make sure you have the aws cli installed, with correct account configuration
```
aws2 ecr get-login
```
then run the output command but take away the "-e none" and run with `sudo`

```
sudo docker tag jacklaplante/bowdown-server:latest 396569707329.dkr.ecr.us-east-1.amazonaws.com/bowdown-server:latest
sudo docker push 396569707329.dkr.ecr.us-east-1.amazonaws.com/bowdown-server:latest
```

DAT.gui example
```
if (process.env.NODE_ENV == 'development') {
  let dat = require('dat.gui')
  let gui = new dat.GUI()
  let v = {refDistance: refDistance}
  gui.add(v, 'refDistance')
}
```