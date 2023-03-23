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
import BulletModel from '../dto/bullet.js';
import PlayerModel from '../dto/player.js';
import ZombieModel from '../dto/zombie.js';
import { CLIENT_MESSAGE_TYPE, ClientMessageModel, ClientPlayerActionModel } from '../dto/clientMessage.js';
import { SERVER_MESSAGE_TYPE, ServerMessageModel, ServerPlayerConnectedMessageModel, ServerWorldModel, ServerWorldUpdateMessageModel } from '../dto/serverMessage.js';

export type ServerMessageCallback = ((data: string) => void);

export default class MockServer {
    private mapWidth: number = 20;
    private mapHeight: number = 20;

    private logicLoop: Loop = new Loop(60, this.update.bind(this));

    private players: Player[] = [];
    private bullets: Bullet[] = [];
    private zombies: Zombie[] = [];

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

    private sendMessageToClient(message: ServerMessageModel) {
        this.mockSocket_sendToClient(JSON.stringify(message));
    }

    private update(deltaTime: number) {
        // Clear bullets array
        this.bullets.length = 0;

        this.players.forEach(player => player.update(deltaTime, this));
        this.zombies.forEach(zombie => zombie.update(deltaTime, this.getMockPlayer()));

        // Send data to client ---------------------
        const world: ServerWorldModel = {
            map: {
                width: this.mapWidth,
                height: this.mapHeight,
            },

            players: this.players.map<PlayerModel>(item => item.toModel()),
            zombies: this.zombies.map<ZombieModel>(item => item.toModel()),

            bullets: this.bullets.map<BulletModel>(item => item.toModel())
        }

        // [TODO] [WIP] [WORKAROUND] Client only controls/updates mock(first) player --------------------------- SHOULD SEND TO EACH CLIENT
        {
            const player: Player = this.getMockPlayer();

            if(!player) { return }

            const message: ServerMessageModel<ServerWorldUpdateMessageModel> = {
                type: SERVER_MESSAGE_TYPE.UPDATE,
                data: {
                    player: player.toModel(),
                    world: world
                }
            }
    
            this.sendMessageToClient(message);
        }
    }

    createBullet(newBullet: Bullet) {
        if (newBullet) {
            newBullet.collisionCheck(this.zombies);

            this.bullets.push(newBullet);
        }
    }

    public onClientMessageReceived(data: string) {
        const message: ClientMessageModel = JSON.parse(data);

        switch (message.type) {
            case CLIENT_MESSAGE_TYPE.REQUEST_CONNECTION:
                const newPlayer: Player = new Player(VectorZero());

                this.players.push(newPlayer);

                const payload: ServerMessageModel<ServerPlayerConnectedMessageModel> = {
                    type: SERVER_MESSAGE_TYPE.ON_CONNECTED,
                    data: {
                        player: newPlayer.toModel()
                    }
                }

                this.mockSocket_sendToClient(JSON.stringify(payload));
            break;

            case CLIENT_MESSAGE_TYPE.UPDATE:
                const clientData = message.data as unknown as ClientPlayerActionModel;
                this.getMockPlayer()?.clientUpdate(clientData);
            break;
        }
    }

    // [TODO] [Workaround] Due only simulating multiple players, return only the first one
    getMockPlayer(): Player {
        if(this.players.length === 0) { return null; }

        return this.players[0];
    }
}