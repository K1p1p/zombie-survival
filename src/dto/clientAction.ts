import Vector from "../core/math/vector";

export interface ClientPlayerAction {
    moveDirection: Vector;
    rotation: number; // Radians
    shoot: boolean;
    reload: boolean;
}