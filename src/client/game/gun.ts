import Vector from "../../core/math/vector";
import GunModel from "../../model/gun";
import ModelStateHandler from "../modelStateHandler";
import SoundManager from "./soundManager";

export default class Gun {
    public state: ModelStateHandler<GunModel>;

    constructor(data: GunModel) {
        this.state = new ModelStateHandler<GunModel>(data);
    }

    public updateState(newState: GunModel, position: Vector) {
        this.state.setState(newState);

        // Finished reloading
        if(!this.state.current.isReloading && this.state.last.isReloading) {
            SoundManager.playReload(position);
        }
    }

    public getAmmo() : number {
        return this.state.current.ammo;
    }
}