import { ClientPlayerConnectionRequest } from "../../dto/clientConnectionRequest";
import { ClientMessage, CLIENT_MESSAGE_TYPE } from "../../dto/clientMessage";
import { ServerMessageCallback } from "../../server/server";
import SingleplayerServer from "../../server/variants/singleplayerServer";

export class SingleplayerGame {
    server: SingleplayerServer;

    constructor(playerNickname: string, onServerMessage: ServerMessageCallback) {
        this.server = new SingleplayerServer(onServerMessage);

        const connectionRequest: ClientMessage<ClientPlayerConnectionRequest> = {
            playerId: "null",
            type: CLIENT_MESSAGE_TYPE.REQUEST_CONNECTION,
            data: {
                nickname: playerNickname
            }
        }
        
        this.sendMessage(JSON.stringify(connectionRequest));
    }

    public sendMessage(data: string) {
        this.server.onClientMessage(data);
    }
}

