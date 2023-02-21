import Vector from "../core/math/vector.js";
import TransformModel from "./transform.js";

export default interface BulletModel extends TransformModel {
    endPosition: Vector;
}