import Loop from "../core/loop";
import Player from "./game/player/player";
import { CLIENT_MESSAGE_TYPE, ClientMessage } from "../dto/clientMessage";
import { SERVER_MESSAGE_TYPE, ServerMessage } from "../dto/serverMessage";
import { ClientPlayerUpdate } from "../dto/clientUpdate";
import { ServerPlayerConnected } from "../dto/serverNewConnection";
import { ServerWorldUpdate } from "../dto/serverUpdate";
import { ClientPlayerConnectionRequest } from "../dto/clientConnectionRequest";
import FPSCounter from "../core/helpers/fpsCounter";
import GameWorld from "./game/world/gameWorld";

export type ServerMessageCallback = (data: string, webSocketId?: string) => void;

class ServerDebug {
    private static counter = new FPSCounter();

    public static displayLog(deltaTime: number, server: Server) {
        ServerDebug.counter.update(deltaTime);

        console.clear();

        console.log(`
        FPS: ${ServerDebug.counter.getFPS()}
        `);
        /*
        Players: ${Object.entries(server.players).length}
        Zombies: ${server.zombies.length}
        */
    }
} 

export default class Server {
    public world: GameWorld = new GameWorld();

    private logicLoop: Loop;

    private sendMessage: ServerMessageCallback;

    constructor(
        updateCallback: ServerMessageCallback,
        simulatedLatencyMilliseconds: number = 20
    ) {
        this.sendMessage = updateCallback;

        const msToFPS: number = 1 / (simulatedLatencyMilliseconds / 1000);
        this.logicLoop = new Loop(msToFPS, this.update.bind(this));
    }

    
    private update(deltaTime: number) {
        this.world.update(deltaTime);

        // Send data to client ---------------------
        for (let key in this.world.players) {
            const player: Player = this.world.players[key];

            const message: ServerMessage<ServerWorldUpdate> = {
                type: SERVER_MESSAGE_TYPE.UPDATE,
                data: {
                    player: player.toModel(),
                    world: this.world.toModel(),
                },
            };

            this.sendMessage(JSON.stringify(message), player.webSocketId);
        }

        // Debug
        //ServerDebug.displayLog(deltaTime, this);
    }

    public onClientMessageReceived(data: string, webSocketId?: string) {
        const message: ClientMessage = JSON.parse(data);
        const player: Player = this.world.players[message.playerId];

        switch (message.type) {
            case CLIENT_MESSAGE_TYPE.REQUEST_CONNECTION:
                {
                    const clientData = message.data as unknown as ClientPlayerConnectionRequest;

                    const newPlayer: Player = new Player(clientData.nickname);
                    newPlayer.webSocketId = webSocketId;

                    this.world.players[newPlayer.entityId] = newPlayer;

                    const payload: ServerMessage<ServerPlayerConnected> = {
                        type: SERVER_MESSAGE_TYPE.ON_CONNECTED,
                        data: {
                            player: newPlayer.toModel(),
                        },
                    };

                    this.sendMessage(JSON.stringify(payload), newPlayer?.webSocketId);
                }
            break;

            case CLIENT_MESSAGE_TYPE.REQUEST_RESPAWN:
                {
                    if (!player) { return; }
                    if (player.isAlive) { return; }

                    // Reset position and health
                    player.health = player.maxHealth;
                    const mapSize: number = this.world.MAP_SIZE;
                    player.transform.position = {
                        x: (Math.random() * mapSize) - (mapSize / 2),
                        y: (Math.random() * mapSize) - (mapSize / 2),
                    };
                }
                break;

            case CLIENT_MESSAGE_TYPE.UPDATE:
                if (!player) { return; }
                if (!player.isAlive) { return; }

                const clientData = message.data as unknown as ClientPlayerUpdate;

                this.world.players[message.playerId]?.clientUpdate(clientData);
                break;
        }
    }
}
