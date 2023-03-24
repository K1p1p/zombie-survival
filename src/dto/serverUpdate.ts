import BulletModel from "../model/bullet";
import PlayerModel from "../model/player";
import ZombieModel from "../model/zombie";

export interface ServerWorld {
    players: PlayerModel[];
    bullets: BulletModel[];
    zombies: ZombieModel[];
    
    map: {
        width: number;
        height: number;
    }
}

export interface ServerWorldUpdate {
    player: PlayerModel;
    world: ServerWorld;
}