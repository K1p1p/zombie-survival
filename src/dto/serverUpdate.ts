import BulletModel from "../model/bullet";
import PlayerModel from "../model/player";
import ZombieModel from "../model/zombie";
import Entity from "./entity";

export interface ServerWorld {
    players: Entity<PlayerModel>[];
    zombies: Entity<ZombieModel>[];

    bullets: BulletModel[];
    
    map: {
        width: number;
        height: number;
    }
}

export interface ServerWorldUpdate {
    player: Entity<PlayerModel>;
    world: ServerWorld;
}