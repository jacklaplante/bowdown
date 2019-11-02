# bowdown

[bowdown.io](https://bowdown.io)


you might need this when changing react components in client/src/components (run in `client`)

```
npx babel --watch src/components --out-dir components/ --presets react-app/prod
```

also here's the command to run a bot

```
cd tools
node runBot.js bots/bot1.json
```

and to record a new bot: start recording with 'R', then stop with 'R' again. Then look at the console to copy/paste the bot into a new json file