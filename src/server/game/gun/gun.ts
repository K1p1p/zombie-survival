import { repeat } from "../../../core/math/index";
import Transform from "../../../core/transform";
import GunModel, { FIRE_MODE } from "../../../model/gun";
import INetworkObject from "../../networkObject";
import Server from "../../server";
import Bullet from "../bullet";
import { GunFiringMechanism } from "./gunFiringMechanism";

export default abstract class Gun implements INetworkObject {
    public name: string = "GUN";

    public ammo: number = 6;
    public ammoCapacity: number = 6;
    public reloadTime: number = 1000; // ms
    public isReloading: boolean = false;

    public attackPower: number = 1;

    public wielderTransform: Transform;

    public cooldownTime: number = 500; // ms
    private lastTimeFired: number = 0;
    private get isInCooldown(): boolean { return (Date.now() - this.lastTimeFired) < this.cooldownTime; }

    private firingMechanism: GunFiringMechanism;
    private firingModeIndex: number = 0;
    protected firingModes: FIRE_MODE[] = [FIRE_MODE.SEMI_AUTO];

    constructor(wielderTransform: Transform) {
        this.wielderTransform = wielderTransform;

        this.firingMechanism = new GunFiringMechanism(this.firingModes[this.firingModeIndex]);
    }

    protected setFireMode(index: number) {
        this.firingModeIndex = index;
        this.firingMechanism.setFireMode(this.firingModes[this.firingModeIndex]);
    }

    public switchFireMode() {
        this.setFireMode(repeat((this.firingModeIndex + 1), this.firingModes.length));
    }

    public triggerPull() {
        this.firingMechanism.onTriggerPull();
    }

    public triggerRelease() {
        this.firingMechanism.onTriggerRelease();
    }

    public update(server: Server) {
        if (this.isInCooldown) { return null; }
        if (this.isReloading) { return null; }
        if (this.ammo == 0) { return null; }

        if (this.firingMechanism.update()) {
            this.ammo -= 1;
            this.lastTimeFired = Date.now();

            server.createBullet(new Bullet(this.wielderTransform.position, this.wielderTransform.direction), this);
        }
    }

    public reload() {
        if (this.isReloading) { return; } // Already reloading
        if (this.ammoCapacity === this.ammo) { return; } // Ammo already full

        this.isReloading = true;

        const onFinished = () => {
            this.ammo = this.ammoCapacity;
            this.isReloading = false;
            this.firingMechanism.reset();
        }

        setTimeout(onFinished, this.reloadTime);
    }

    toModel(): GunModel {
        return {
            name: this.name,

            ammo: this.ammo,
            ammoCapacity: this.ammoCapacity,
            isReloading: this.isReloading,
            fireMode: this.firingModes[this.firingModeIndex]
        }
    }
}