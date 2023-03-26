import GunModel from "./gun";
import TransformModel from "./transform";

export default interface PlayerModel {
    health: number;
    maxHealth: number;
    transform: TransformModel;
    speed: number;
    gun: GunModel;
}