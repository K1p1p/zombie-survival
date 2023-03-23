import BulletModel from "./bullet.js";
import PlayerModel from "./player.js";
import ZombieModel from "./zombie.js";

export enum SERVER_MESSAGE_TYPE {
    ON_CONNECTED,
    UPDATE
}

export interface ServerMessageModel<T=any> {
    type: SERVER_MESSAGE_TYPE;
    data: T;
}

export interface ServerPlayerConnectedMessageModel {
    player: PlayerModel;
}

export interface ServerWorldModel {
    players: PlayerModel[];
    bullets: BulletModel[];
    zombies: ZombieModel[];
    
    map: {
        width: number;
        height: number;
    }
}

export interface ServerWorldUpdateMessageModel {
    player: PlayerModel;
    world: ServerWorldModel;
}
