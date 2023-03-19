import GunModel from "../../dto/gun";
import SoundManager from "./soundManager.js";

export default class Gun {
    public state: GunModel;
    private lastState: GunModel;

    constructor(data: GunModel) {
        this.state = data;
        this.lastState = this.state;
    }

    public update(newState: GunModel) {
        this.lastState = this.state;
        this.state = newState;

        // Finished reloading
        if(!this.state.isReloading && this.lastState.isReloading) {
            SoundManager.playReload();
        }
    }
}