import Vector from "../core/math/vector.js";

export default interface PlayerActionRequestModel {
    moveDirection: Vector;
    rotation: number; // Radians
    shoot: boolean;
    reload: boolean;
}