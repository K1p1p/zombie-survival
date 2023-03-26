import { AddressInfo, Server as WSServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import Server from '../server';
import { Dictionary } from '../../core/helpers/dictionary';

const server: Server = new Server(onServerMessage);
const webSocketServer = new WSServer({ port: 2222 });

const clients: Dictionary<WebSocket> = {}

function onServerMessage(data: string, webSocketId?: string) {
    if(!webSocketId) { return; }

    //const message: ServerMessage = JSON.parse(data);

    // @ts-ignore
    clients[webSocketId].send(data);
}

webSocketServer.on('listening', () => {
    const address: AddressInfo = (webSocketServer.address() as AddressInfo);
    console.log(`Server listening: ${address.address}:${address.port} - ${address.family}`);
})

webSocketServer.on('connection', (client: WebSocket) => {
    console.log('New client connected!'); 

    //Create Unique User ID for client
    const clientUID: string = uuidv4();

    clients[clientUID] = client;
    
    //Method retrieves message from client
    client.on('message', (data) => {     
        server.onClientMessageReceived(data.toString(), clientUID);
    })

    //Method notifies when client disconnects
    client.on('close', (a) => {
        console.log("Client disconnected!")

        delete clients[clientUID];

        const player = Object.values(server.players).find((player) => (player.webSocketId === clientUID));
        if(player) {
            delete server.players[player.id];
        }
    })
});