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

export type ServerUpdateCallback = ((data: string) => void);
export type ServerData = {
    mapWidth: number;
    mapHeight: number;
    player: PlayerModel;
    bullets: BulletModel[];
    zombies: ZombieModel[];
}

export default class MockServer {
    private mapWidth: number = 20;
    private mapHeight: number = 20;
    
    private logicLoop: Loop = new Loop(60, this.update.bind(this));
    
    private player: Player = new Player(VectorZero());
    private playerActionRequest: PlayerActionRequestModel = {
        moveDirection: VectorZero(),
        rotation: 0,
        shoot: false,
        reload: false
    }

    private bullets: Bullet[] = [];
    private zombies: Zombie[] = [];

    private updateCallback: ServerUpdateCallback;

    constructor(updateCallback: ServerUpdateCallback) {
        this.updateCallback = updateCallback;

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
        
        this.player.update(deltaTime, this.playerActionRequest);
        this.zombies.forEach(zombie => zombie.update(deltaTime, this.player));

        if(this.playerActionRequest.reload) {
            this.player.reload();
        }

        if(this.playerActionRequest.shoot) {
            const newBullet = this.player.shoot();

            if(newBullet) {
                newBullet.collisionCheck(this.zombies);

                this.bullets.push(newBullet);
            }
        }

        // Send data to client ---------------------
        this.updateCallback(JSON.stringify({
            mapWidth: this.mapWidth,
            mapHeight: this.mapHeight,
            player: this.player.toModel(),
            bullets: this.bullets.map<BulletModel>(item => item.toModel()),
            zombies: this.zombies.map<ZombieModel>(item => item.toModel())
        }))

        // Clear player action buffer ---------------------
        this.playerActionRequest.moveDirection = VectorZero();
        //this.playerActionBuffer.rotation = DO_NOT_CHANGE; // Keep rotation! Otherwise player rotates to zero when not moving!
        this.playerActionRequest.shoot = false;
        this.playerActionRequest.reload = false;
    }

    // Handle player requests
    public clientMessage(data: string) {
        // Buffer player actions 
        this.playerActionRequest = JSON.parse(data) as PlayerActionRequestModel;
        this.playerActionRequest.moveDirection = Vector.normalize(this.playerActionRequest.moveDirection); // Sanitize input
    }
}