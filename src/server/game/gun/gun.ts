import { repeat } from "../../../core/math/index";
import GunModel, { FIRE_MODE, GUN_ID } from "../../../model/gun";
import INetworkObject from "../../networkObject";
import AmmoPouch from "../ammoPouch";
import Bullet from "../bullet";
import GameObject from "../gameObject";
import GameWorld from "../world/gameWorld";
import { GunFiringMechanism } from "./gunFiringMechanism";

export default abstract class Gun implements INetworkObject {
    public name: string = "GUN";

    public ammo: number = 6;
    public ammoCapacity: number = 6;
    public reloadTime: number = 1000; // ms
    public isReloading: boolean = false;

    public attackPower: number = 1;

    public wielder: GameObject;

    public cooldownTime: number = 500; // ms
    private lastTimeFired: number = 0;
    private get isInCooldown(): boolean { return (Date.now() - this.lastTimeFired) < this.cooldownTime; }

    private firingMechanism: GunFiringMechanism;
    private firingModeIndex: number = 0;
    protected firingModes: FIRE_MODE[] = [FIRE_MODE.SEMI_AUTO];

    public id: GUN_ID = GUN_ID.GENERIC_PISTOL;

    private reloadIntervalHandler: NodeJS.Timeout | undefined;
    private ammoPouch: AmmoPouch | undefined;

    constructor(wielder: GameObject) {
        this.wielder = wielder;

        this.firingMechanism = new GunFiringMechanism(this.firingModes[this.firingModeIndex]);
    }

    public onEquip(ammoPouch: AmmoPouch) {
        this.ammoPouch = ammoPouch;
    }

    public onUnequip() {
        if(this.isReloading && this.reloadIntervalHandler) {
            this.isReloading = false;
            clearInterval(this.reloadIntervalHandler);
        }

        this.ammoPouch = undefined;
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

    public update(server: GameWorld) {
        if (this.isInCooldown) { return null; }
        if (this.isReloading) { return null; }
        if (this.ammo == 0) { return null; }

        if (this.firingMechanism.update()) {
            this.ammo -= 1;
            this.lastTimeFired = Date.now();

            server.createBullet(this.wielder, new Bullet(this.wielder.transform.position, this.wielder.transform.direction), this);
        }
    }

    public reload() {
        const ammoPouch = this.ammoPouch?.getAmmoPouchItem(this.id);

        if (!ammoPouch) { return; } // Ammo pouch not found
        if (ammoPouch.ammo === 0) { return; } // No ammo to reload
        if (this.isReloading) { return; } // Already reloading
        if (this.ammoCapacity === this.ammo) { return; } // Ammo already full

        this.isReloading = true;

        const onFinished = () => {
            this.ammo += ammoPouch.removeAmmo(this.ammoCapacity - this.ammo);
            this.isReloading = false;
            this.firingMechanism.reset();

            this.reloadIntervalHandler = undefined;
        }

       this.reloadIntervalHandler = setTimeout(onFinished, this.reloadTime);
    }

    toModel(): GunModel {
        return {
            id: this.id,
            name: this.name,

            ammo: this.ammo,
            ammoCapacity: this.ammoCapacity,
            totalAmmo: (this.ammoPouch?.getAmmoPouchItem(this.id)?.ammo) ?? 0,
            isReloading: this.isReloading,
            fireMode: this.firingModes[this.firingModeIndex]
        }
    }
}