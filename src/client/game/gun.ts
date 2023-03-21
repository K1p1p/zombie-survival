import GunModel from "../../dto/gun";
import ModelStateHandler from "../modelStateHandler.js";
import SoundManager from "./soundManager.js";

export default class Gun {
    public state: ModelStateHandler<GunModel>;

    constructor(data: GunModel) {
        this.state = new ModelStateHandler<GunModel>(data);
    }

    public updateState(newState: GunModel) {
        this.state.setState(newState);

        // Finished reloading
        if(!this.state.current.isReloading && this.state.last.isReloading) {
            SoundManager.playReload();
        }
    }

    public getAmmo() : number {
        return this.state.current.ammo;
    }
}