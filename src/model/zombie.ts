import TransformModel from "./transform";

export default interface ZombieModel {
    health: number;
    maxHealth: number;
    transform: TransformModel;
    speed: number;
    color: string;
    size: number;
}