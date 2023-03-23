import BulletModel from "./bullet";
import PlayerModel from "./player";
import ZombieModel from "./zombie";

export interface ServerWorldModel {
    players: PlayerModel[];
    bullets: BulletModel[];
    zombies: ZombieModel[];
    
    map: {
        width: number;
        height: number;
    }
}

export interface ServerWorldMessageModel {
    player: PlayerModel;
    world: ServerWorldModel;
}
