import Loop from "../core/loop";
import Vector, { VectorZero } from "../core/math/vector";
import Player from "./game/player";
import Bullet from "./game/bullet";
import Zombie from "./game/zombie";
import { CLIENT_MESSAGE_TYPE, ClientMessage } from "../dto/clientMessage";
import { SERVER_MESSAGE_TYPE, ServerMessage } from "../dto/serverMessage";
import { Dictionary } from "../core/helpers/dictionary";
import BulletModel from "../model/bullet";
import PlayerModel from "../model/player";
import ZombieModel from "../model/zombie";
import { ClientPlayerUpdate } from "../dto/clientUpdate";
import { ServerPlayerConnected } from "../dto/serverNewConnection";
import { ServerWorld, ServerWorldUpdate } from "../dto/serverUpdate";
import Entity from "../dto/entity";
import Circle from "../core/geometry/circle";
import Gun from "./game/gun/gun";
import { ClientPlayerConnectionRequest } from "../dto/clientConnectionRequest";
import FPSCounter from "../core/helpers/fpsCounter";

export type ServerMessageCallback = (data: string, webSocketId?: string) => void;

class ServerDebug {
    private static counter = new FPSCounter();

    public static displayLog(deltaTime: number, server: Server) {
        ServerDebug.counter.update(deltaTime);

        console.clear();

        console.log(`
        FPS: ${ServerDebug.counter.getFPS()}
        Players: ${Object.entries(server.players).length}
        Zombies: ${server.zombies.length}
        `);
    }
} 

export default class Server {
    public mapWidth: number = 20;
    public mapHeight: number = 20;

    private logicLoop: Loop;

    public players: Dictionary<Player> = {};
    public zombies: Dictionary<Zombie> = {};
    public bullets: Bullet[] = [];

    private sendMessage: ServerMessageCallback;

    constructor(
        updateCallback: ServerMessageCallback,
        simulatedLatencyMilliseconds: number = 20
    ) {
        this.sendMessage = updateCallback;

        const msToFPS: number = 1 / (simulatedLatencyMilliseconds / 1000);
        this.logicLoop = new Loop(msToFPS, this.update.bind(this));

        setInterval(() => {
            const pos: Vector = {
                x: Math.random() * this.mapWidth - this.mapWidth / 2,
                y: Math.random() * this.mapHeight - this.mapHeight / 2,
            };

            const newZombie: Zombie = new Zombie(pos);
            this.zombies[newZombie.id] = newZombie;
        }, 2000);
    }

    
    private update(deltaTime: number) {
        // Clear bullets array
        this.bullets.length = 0;

        // Update players
        Object.values(this.players).forEach((player) => player.update(deltaTime, this));

        // Update zombies
        Object.values(this.zombies).forEach((zombie) => zombie.update(deltaTime, Object.values(this.players)));

        // Send data to client ---------------------
        const world: ServerWorld = {
            map: {
                width: this.mapWidth,
                height: this.mapHeight,
            },

            players: Object.values(this.players).map<Entity<PlayerModel>>((item) => item.toModel()),
            zombies: Object.values(this.zombies).map<Entity<ZombieModel>>((item) => item.toModel()),

            bullets: this.bullets.map<BulletModel>((item) => item.toModel()),
        };

        for (let key in this.players) {
            const player: Player = this.players[key];

            const message: ServerMessage<ServerWorldUpdate> = {
                type: SERVER_MESSAGE_TYPE.UPDATE,
                data: {
                    player: player.toModel(),
                    world: world,
                },
            };

            this.sendMessage(JSON.stringify(message), player.webSocketId);
        }

        // Debug
        //ServerDebug.displayLog(deltaTime, this);
    }

    createBullet(newBullet: (Bullet | null), gun: (Gun | null)) {
        if (!gun) { return; }
        if (!newBullet) { return; }

        const hit = newBullet.collisionCheck(Object.values(this.zombies));

        if (hit) {
            // Damage zombie
            hit.health -= gun.attackPower;

            if (hit.health <= 0) {
                // Destroy zombie
                delete this.zombies[hit.id];
            }
        }

        this.bullets.push(newBullet);
    }

    public onClientMessageReceived(data: string, webSocketId?: string) {
        const message: ClientMessage = JSON.parse(data);
        const player: Player = this.players[message.playerId];

        switch (message.type) {
            case CLIENT_MESSAGE_TYPE.REQUEST_CONNECTION:
                {
                    const clientData = message.data as unknown as ClientPlayerConnectionRequest;

                    const newPlayer: Player = new Player(clientData.nickname);
                    newPlayer.webSocketId = webSocketId;

                    this.players[newPlayer.id] = newPlayer;

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
                    player.transform.position = {
                        x: Math.random() * this.mapWidth - this.mapWidth / 2,
                        y: Math.random() * this.mapHeight - this.mapHeight / 2,
                    };
                }
                break;

            case CLIENT_MESSAGE_TYPE.UPDATE:
                if (!player) { return; }
                if (!player.isAlive) { return; }

                const clientData = message.data as unknown as ClientPlayerUpdate;

                this.players[message.playerId]?.clientUpdate(clientData);
                break;
        }
    }
}
