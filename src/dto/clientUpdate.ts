import Vector from "../core/math/vector";

export interface ClientPlayerUpdate {
    moveDirection: Vector;
    rotation: number; // Radians
    shoot: boolean;
    reload: boolean;
}