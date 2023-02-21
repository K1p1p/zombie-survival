import Vector from "../core/math/vector.js";

export default interface TransformModel {
    position: Vector;
    rotation: number;
    direction: Vector;
}