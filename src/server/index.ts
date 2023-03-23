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
import PlayerActionRequestModel from '../dto/playerActionRequest.js';
import { ServerWorldMessageModel, ServerWorldModel } from '../dto/serverWorldMessage.js';

export type ServerMessageCallback = ((data: string) => void);

export default class MockServer {
    private mapWidth: number = 20;
    private mapHeight: number = 20;
    
    private logicLoop: Loop = new Loop(60, this.update.bind(this));

    private players: Player[] = [ new Player(VectorZero()), new Player({ x: 1, y: 1 }) ];
    private bullets: Bullet[] = [];
    private zombies: Zombie[] = [];

    private sendMessageToClient: ServerMessageCallback;

    constructor(updateCallback: ServerMessageCallback) {
        this.sendMessageToClient = updateCallback;

        setInterval(() => {
            const pos: Vector = {
                x: ((Math.random() * this.mapWidth) - (this.mapWidth / 2)),
                y: ((Math.random() * this.mapHeight) - (this.mapHeight / 2)),
            }
            
            this.zombies.push(new Zombie(pos));
        }, 1000);
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

        // [TODO] [WIP] [WORKAROUND] Client only controls mock(first) player
        this.sendMessageToClient(JSON.stringify({
            player: this.getMockPlayer().toModel(),
            world: world
        }));
       /* this.players.forEach((player) => {
            const data: ServerWorldMessageModel = {
                player: player.toModel(),
                world: world
            }

            this.sendMessageToClient(JSON.stringify(data));
        })*/
    }

    createBullet(newBullet: Bullet) {
        if(newBullet) {
            newBullet.collisionCheck(this.zombies);

            this.bullets.push(newBullet);
        }
    }

    // Handle player requests
    public clientMessage(data: string) {
        const clientData = JSON.parse(data) as PlayerActionRequestModel;
        this.getMockPlayer().clientUpdate(clientData);
    }

    // [TODO] [Workaround] Due only simulating multiple players, return only the first one
    getMockPlayer(): Player {
        return this.players[0];
    }
}