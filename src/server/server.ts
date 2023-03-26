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
import { ClientPlayerAction } from "../dto/clientAction";
import { ServerPlayerConnected } from "../dto/serverNewConnection";
import { ServerWorld, ServerWorldUpdate } from "../dto/serverUpdate";
import Entity from "../dto/entity";
import Circle from "../core/geometry/circle";
import Gun from "./game/gun";

export type ServerMessageCallback = (data: string) => void;

export default class Server {
    public mapWidth: number = 20;
    public mapHeight: number = 20;

    private logicLoop: Loop;

    public players: Dictionary<Player> = {};
    public bullets: Bullet[] = [];
    public zombies: Zombie[] = [];

    private sendMessage: ServerMessageCallback;

    constructor(
        updateCallback: ServerMessageCallback,
        simulatedLatencyMilliseconds: number = 16
    ) {
        this.sendMessage = updateCallback;

        const msToFPS: number = 1 / (simulatedLatencyMilliseconds / 1000);
        this.logicLoop = new Loop(msToFPS, this.update.bind(this));

        setInterval(() => {
            const pos: Vector = {
                x: Math.random() * this.mapWidth - this.mapWidth / 2,
                y: Math.random() * this.mapHeight - this.mapHeight / 2,
            };

            this.zombies.push(new Zombie(pos));
        }, 1000);
    }

    private update(deltaTime: number) {
        // Clear bullets array
        this.bullets.length = 0;

        Object.values(this.players).forEach((player) =>
            player.update(deltaTime, this)
        );

        // Update zombies
        this.zombies.forEach((zombie) => {
            // Get nearest alive player
            let nearestPlayer: (Player | undefined) = undefined;
            let nearestPlayerDistance: number = Number.POSITIVE_INFINITY;
            Object.values(this.players).forEach((player) => {
                if (!player.isAlive) {
                    return;
                }

                const distance: number = Vector.magnitude({
                    x: player.position.x - zombie.position.x,
                    y: player.position.y - zombie.position.y,
                });

                if (distance < nearestPlayerDistance) {
                    nearestPlayer = player;
                    nearestPlayerDistance = distance;
                }
            });

            // Update zombie
            zombie.update(deltaTime, nearestPlayer);

            if (nearestPlayer != undefined) {
                // Check collision with player, then damages it
                // @ts-ignore
                const playerCollider: Circle = nearestPlayer.collider;
                if (Circle.intersectsSphere(zombie.collider, playerCollider)) {
                    // @ts-ignore
                    nearestPlayer.health -= zombie.attackPower * deltaTime;
                }
            }
        });

        // Send data to client ---------------------
        const world: ServerWorld = {
            map: {
                width: this.mapWidth,
                height: this.mapHeight,
            },

            players: Object.values(this.players).map<Entity<PlayerModel>>((item) =>
                item.toModel()
            ),
            zombies: this.zombies.map<Entity<ZombieModel>>((item) => item.toModel()),

            bullets: this.bullets.map<BulletModel>((item) => item.toModel()),
        };

        for (let key in this.players) {
            const message: ServerMessage<ServerWorldUpdate> = {
                type: SERVER_MESSAGE_TYPE.UPDATE,
                data: {
                    player: this.players[key].toModel(),
                    world: world,
                },
            };

            this.sendMessage(JSON.stringify(message));
        }
    }

    createBullet(newBullet: (Bullet | null), gun: (Gun | null)) {
        if (!gun) { return; }
        if (!newBullet) { return; }

        const hit = newBullet.collisionCheck(this.zombies);

        if (hit) {
            // Damage zombie
            hit.zombie.health -= gun.attackPower;

            if (hit.zombie.health <= 0) {
                // Destroy zombie
                this.zombies.splice(hit.zombieIndex, 1);
            }
        }

        this.bullets.push(newBullet);
    }

    public onClientMessageReceived(data: string) {
        const message: ClientMessage = JSON.parse(data);

        switch (message.type) {
            case CLIENT_MESSAGE_TYPE.REQUEST_CONNECTION:
                {
                    const newPlayer: Player = new Player(VectorZero());

                    this.players[newPlayer.id] = newPlayer;

                    const payload: ServerMessage<ServerPlayerConnected> = {
                        type: SERVER_MESSAGE_TYPE.ON_CONNECTED,
                        data: {
                            player: newPlayer.toModel(),
                        },
                    };

                    this.sendMessage(JSON.stringify(payload));
                }
            break;

            case CLIENT_MESSAGE_TYPE.REQUEST_RESPAWN:
                {
                    const player: Player = this.players[message.playerId];

                    if (!player) {
                        return;
                    }
                    if (player.isAlive) {
                        return;
                    }

                    // Reset position and health
                    player.position = VectorZero();
                    player.health = player.maxHealth;
                }
                break;

            case CLIENT_MESSAGE_TYPE.UPDATE:
                const clientData = message.data as unknown as ClientPlayerAction;
                this.players[message.playerId]?.clientUpdate(clientData);
                break;
        }
    }
}
