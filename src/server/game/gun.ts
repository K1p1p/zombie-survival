import Transform from "../../core/transform.js";
import GunModel from "../../model/gun";
import INetworkObject from "../networkObject";
import Bullet from "./bullet.js";

export default class Gun implements INetworkObject {
    ammo: number = 6;
    ammoCapacity: number = 6;
    reloadTime: number = 1000; // ms
    isReloading: boolean;

    wielderTransform: Transform;

    constructor(wielderTransform: Transform) {
        this.wielderTransform = wielderTransform;
    }

    public shoot(): (Bullet | null) {
        if(this.isReloading) { return null; }
        if(this.ammo == 0  ) { return null; }

        this.ammo -= 1;

        return new Bullet(this.wielderTransform.position, this.wielderTransform.direction)
    }

    public reload() {
        if(this.isReloading) { return; } // Already reloading
        if(this.ammoCapacity === this.ammo) { return; } // Ammo already full

        this.isReloading = true;

        const onFinished = () => {
            this.ammo = this.ammoCapacity;
            this.isReloading = false;
        }

        setTimeout(onFinished, this.reloadTime);
    }

    toModel(): GunModel {
        return {
            ammo: this.ammo,
            ammoCapacity: this.ammoCapacity,
            isReloading: this.isReloading
        }
    }
}