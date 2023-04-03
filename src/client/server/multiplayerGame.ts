import { ClientPlayerConnectionRequest } from "../../dto/clientConnectionRequest";
import { ClientMessage, CLIENT_MESSAGE_TYPE } from "../../dto/clientMessage";
import { ServerMessageCallback } from "../../server/server";

export class MultiplayerGame {
    webSocket: WebSocket;

    constructor(playerNickname: string, onServerMessage: ServerMessageCallback) {
        const serverEndpoint = prompt("Server endpoint", sessionStorage.getItem("server-endpoint") ?? 'ws://localhost:2222/') ?? "unknown";
        sessionStorage.setItem("server-endpoint", serverEndpoint);

        this.webSocket = new WebSocket(serverEndpoint ?? 'ws://localhost:2222/');

        this.webSocket.onmessage = async (event: MessageEvent) => {
            onServerMessage(event.data.toString());
        };

        this.webSocket.onopen = async () => {
            const connectionRequest: ClientMessage<ClientPlayerConnectionRequest> = {
                playerId: "null",
                type: CLIENT_MESSAGE_TYPE.REQUEST_CONNECTION,
                data: {
                    nickname: playerNickname
                }
            }

            if (this.webSocket.readyState === WebSocket.OPEN) {
                this.webSocket.send(JSON.stringify(connectionRequest));
            } else {
                console.warn("webSocket is not connected");
            }
        };
    }

    public sendMessage(data: string) {
        this.webSocket.send(data);
    }
}