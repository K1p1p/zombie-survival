/*import { Server as WSServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

private server = new WSServer({ port: 443 });
    
    server.on('connection', (client) => {
       console.log('New client connected!'); 
    
       //Create Unique User ID for player
       client.id = uuidv4();
       
       //Send default client data back to client for reference
       client.send(`{"id": "${client.id}"}`)
    
       //Method retrieves message from client
       client.on('message', (data) => {        
    
       })
    
       //Method notifies when client disconnects
       client.on('close', () => {
    
       })
    });
*/

import Loop from '../core/loop.js';
import Vector, { VectorZero } from '../core/math/vector.js';
import Player from '../server/game/player.js';
import Bullet from '../server/game/bullet.js';
import Zombie from '../server/game/zombie.js';
import { CLIENT_MESSAGE_TYPE, ClientMessage } from '../dto/clientMessage.js';
import { SERVER_MESSAGE_TYPE, ServerMessage } from '../dto/serverMessage.js';
import { Dictionary } from '../core/helpers/dictionary.js';
import BulletModel from '../model/bullet';
import PlayerModel from '../model/player';
import ZombieModel from '../model/zombie';
import { ClientPlayerAction } from '../dto/clientAction';
import { ServerPlayerConnected } from '../dto/serverNewConnection';
import { ServerWorld, ServerWorldUpdate } from '../dto/serverUpdate';
import Entity from '../dto/entity';
import Circle from '../core/geometry/circle.js';

export type ServerMessageCallback = ((data: string) => void);

export default class MockServer {
    private mapWidth: number = 20;
    private mapHeight: number = 20;

    private logicLoop: Loop = new Loop(60, this.update.bind(this));

    private players: Dictionary<Player> = {};
    private bullets: Bullet[] = [];
    private zombies: Zombie[] = [];

    // [MOCK]
    private mockClient_id: string;
    private get mockClient_player(): Player { return this.players[this.mockClient_id];  }
    private mockSocket_sendToClient: ServerMessageCallback;

    constructor(updateCallback: ServerMessageCallback) {
        this.mockSocket_sendToClient = updateCallback;

        setInterval(() => {
            const pos: Vector = {
                x: ((Math.random() * this.mapWidth) - (this.mapWidth / 2)),
                y: ((Math.random() * this.mapHeight) - (this.mapHeight / 2)),
            }

            this.zombies.push(new Zombie(pos));
        }, 1000);
    }

    private sendMessageToClient(message: ServerMessage) {
        this.mockSocket_sendToClient(JSON.stringify(message));
    }

    private update(deltaTime: number) {
        // Clear bullets array
        this.bullets.length = 0;

        Object.values(this.players).forEach(player => player.update(deltaTime, this));
        this.zombies.forEach(zombie => {
            zombie.update(deltaTime, this.mockClient_player);

            // Check collision with player, then damages it
            const playerCollider: Circle = this.mockClient_player.collider;
            if(Circle.intersectsSphere(zombie.collider, playerCollider)) {
                this.mockClient_player.health -= (zombie.attackPower * deltaTime);
            }
        });

        // Send data to client ---------------------
        const world: ServerWorld = {
            map: {
                width: this.mapWidth,
                height: this.mapHeight,
            },

            players: Object.values(this.players).map<Entity<PlayerModel>>(item => item.toModel()),
            zombies: this.zombies.map<Entity<ZombieModel>>(item => item.toModel()),

            bullets: this.bullets.map<BulletModel>(item => item.toModel())
        }

        // [TODO] [WIP] [WORKAROUND] Client only controls/updates mock(first) player --------------------------- SHOULD SEND TO EACH CLIENT
        {
            if(!this.mockClient_player) { return }

            const message: ServerMessage<ServerWorldUpdate> = {
                type: SERVER_MESSAGE_TYPE.UPDATE,
                data: {
                    player: this.mockClient_player.toModel(),
                    world: world
                }
            }
    
            this.sendMessageToClient(message);
        }
    }

    createBullet(newBullet: Bullet) {
        if (newBullet) {
            const hit = newBullet.collisionCheck(this.zombies);

            if(hit) {
                // Damage zombie
                hit.zombie.health -= this.mockClient_player.gun.attackPower;

                if(hit.zombie.health <= 0) {
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
                const newPlayer: Player = new Player(VectorZero());

                this.players[newPlayer.id] = newPlayer;

                const payload: ServerMessage<ServerPlayerConnected> = {
                    type: SERVER_MESSAGE_TYPE.ON_CONNECTED,
                    data: {
                        player: newPlayer.toModel()
                    }
                }

                this.mockClient_id = newPlayer.id;
                this.mockSocket_sendToClient(JSON.stringify(payload));
            break;

            case CLIENT_MESSAGE_TYPE.REQUEST_RESPAWN:
                if(!this.mockClient_player.isAlive){
                    this.players[this.mockClient_id] = new Player(VectorZero());
                }
            break;

            case CLIENT_MESSAGE_TYPE.UPDATE:
                const clientData = message.data as unknown as ClientPlayerAction;
                this.players[message.clientId]?.clientUpdate(clientData);
            break;
        }
    }
}