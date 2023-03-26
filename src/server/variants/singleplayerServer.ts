import Server, { ServerMessageCallback } from '../server.js';
import { ClientMessage } from '../../dto/clientMessage.js';
import { ServerPlayerConnected } from '../../dto/serverNewConnection.js';
import { ServerWorldUpdate } from '../../dto/serverUpdate.js';
import { SERVER_MESSAGE_TYPE, ServerMessage } from '../../dto/serverMessage.js';

export default class SingleplayerServer {
    private server: Server;
    private onMessage: ServerMessageCallback;

    private clientPlayerId: string;

    constructor(onMessage: ServerMessageCallback, simulatedLatencyMilliseconds: number = 16) {
        this.onMessage = onMessage;
        
        this.server = new Server(this.onServerMessage.bind(this), simulatedLatencyMilliseconds);
    }

    private onServerMessage(data: string) {
        const message: ServerMessage = JSON.parse(data);

        switch (message.type) {
            case SERVER_MESSAGE_TYPE.ON_CONNECTED:
                {
                    const serverData = message.data as unknown as ServerPlayerConnected;

                    // Get mock player id
                    this.clientPlayerId = serverData.player.id;

                    this.onMessage(data);
                }
            break;

            case SERVER_MESSAGE_TYPE.UPDATE:
                {
                    const serverData = message.data as unknown as ServerWorldUpdate;

                    // Block updates from other players
                    if(serverData.player.id !== this.clientPlayerId) { return; }

                    this.onMessage(data);
                }
            break;
        }        
    }

    public onClientMessage(data: string) {
        const message: ClientMessage = JSON.parse(data);

        // Set mock player id
        message.playerId = this.clientPlayerId;

        this.server.onClientMessageReceived(JSON.stringify(message));
    }
}