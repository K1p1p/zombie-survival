import GunModel from "./gun";
import TransformModel from "./transform";

export default interface PlayerModel {
    transform: TransformModel;
    gun: GunModel;
}