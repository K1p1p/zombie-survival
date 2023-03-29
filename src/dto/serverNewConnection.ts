import PlayerModel from "../model/player";
import Entity from "./entity";

export interface ServerPlayerConnected {
    player: Entity<PlayerModel>;
}