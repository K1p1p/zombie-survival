import BulletModel from "../model/bullet";
import { LootModel } from "../model/loot";
import PlayerModel from "../model/player";
import ZombieModel from "../model/zombie";
import Entity from "./entity";

export interface ServerWorld {
    players: Entity<PlayerModel>[];
    zombies: Entity<ZombieModel>[];
    
    loot: Entity<LootModel>[];

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