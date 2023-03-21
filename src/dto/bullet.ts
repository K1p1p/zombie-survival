import Vector from "../core/math/vector";
import TransformModel from "./transform.js";

export default interface BulletModel {
    transform: TransformModel;
    endPosition: Vector;
}