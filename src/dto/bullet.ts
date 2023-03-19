import Vector from "../core/math/vector";
import TransformModel from "./transform.js";

export default interface BulletModel extends TransformModel {
    endPosition: Vector;
}