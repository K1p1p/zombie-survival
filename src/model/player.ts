import GunModel from "./gun";
import TransformModel from "./transform";

export default interface PlayerModel {
    id: string;
    transform: TransformModel;
    gun: GunModel;
}