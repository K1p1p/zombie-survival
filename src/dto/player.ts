import GunModel from "./gun";
import TransformModel from "./transform";

export default interface PlayerModel extends TransformModel {
    gun: GunModel;
}