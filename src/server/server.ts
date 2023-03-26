import Loop from "../core/loop.js";
import Vector, { VectorZero } from "../core/math/vector.js";
import Player from "./game/player.js";
import Bullet from "./game/bullet.js";
import Zombie from "./game/zombie.js";
import { CLIENT_MESSAGE_TYPE, ClientMessage } from "../dto/clientMessage.js";
import { SERVER_MESSAGE_TYPE, ServerMessage } from "../dto/serverMessage.js";
import { Dictionary } from "../core/helpers/dictionary.js";
import BulletModel from "../model/bullet.js";
import PlayerModel from "../model/player.js";
import ZombieModel from "../model/zombie.js";
import { ClientPlayerAction } from "../dto/clientAction.js";
import { ServerPlayerConnected } from "../dto/serverNewConnection.js";
import { ServerWorld, ServerWorldUpdate } from "../dto/serverUpdate.js";
import Entity from "../dto/entity.js";
import Circle from "../core/geometry/circle.js";
import Gun from "./game/gun.js";

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
            let nearestPlayer: Player = null;
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

            if (nearestPlayer) {
                // Check collision with player, then damages it
                const playerCollider: Circle = nearestPlayer.collider;
                if (Circle.intersectsSphere(zombie.collider, playerCollider)) {
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

    createBullet(newBullet: Bullet, gun: Gun) {
        if (newBullet) {
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
