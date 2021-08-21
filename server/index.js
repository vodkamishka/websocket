const express = require('express');
const app = express();
const WSServer = require('express-ws')(app);

const aWss = WSServer.getWss();

const PORT = process.env.PORT || 5000;

app.ws('/', (ws, req) => {
    console.log('Connection is done');
    ws.send('You are succeed connected')
    ws.on('message', msg => {
        msg = JSON.parse(msg);
        switch (msg.method) {
            case 'connection':
                connectionHandler(ws, msg);
                break;
            case 'draw': {
                broadCastConnection(ws, msg);
                break;
            }
        }
    })
})

app.listen(PORT, () => {
    console.log(`Server have started on port ${PORT}`)
})

const connectionHandler = (ws, msg) => {
    ws.id = msg.id;
    broadCastConnection(ws, msg)
}

const broadCastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}