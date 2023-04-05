# Project
## What is:
A simple singleplayer/multiplayer browser game using typescript, websocket, webpack and node.<br>
Nothing is optimized for the sake of simplicity.

## Why was this made:
I couldn't find examples of simple network-based games.

# File server
Browser blocks local file access due CORS policy. Do not forget to run a local file server.<br>
I use [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb), but [Serve](https://www.npmjs.com/package/serve) comes within this project and can be used too.
## Serve
``` sh
npm run file-server
```

# Node modules
``` sh
npm install
```

# Client
## Build
``` sh
npm run build
```

# Local server
``` sh
npm run server
```

# External server
## ngrok
I use [ngrok](https://ngrok.com/) forwarding to my local server.

``` sh
ngrok tcp 2222
```

Then connect to the endpoint.<br>
<br>
** We are using websocket, thus edit the first 'tcp' from the endpoint **<br>

tcp://0.tcp.sa.ngrok.io:XXXXXX/<br>

To:<br>

ws://0.tcp.sa.ngrok.io:XXXXXX/<br>

<br>
<br>
<br>

# [#Game assets](https://github.com/K1p1p/zombie-survival/blob/main/assets-source.md)
