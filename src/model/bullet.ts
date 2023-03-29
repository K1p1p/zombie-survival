import Vector from "../core/math/vector";
import TransformModel from "./transform";

export default interface BulletModel {
    transform: TransformModel;
    endPosition: Vector;
}