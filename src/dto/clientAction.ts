import Vector from "../core/math/vector.js";

export interface ClientPlayerAction {
    moveDirection: Vector;
    rotation: number; // Radians
    shoot: boolean;
    reload: boolean;
}