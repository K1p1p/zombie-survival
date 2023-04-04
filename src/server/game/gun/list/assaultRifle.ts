import { FIRE_MODE, GUN_ID } from "../../../../model/gun";
import GameObject from "../../gameObject";
import Gun from "../gun";

export default class AssaultRifle extends Gun {
    constructor(wielder: GameObject) {
        super(wielder);

        this.id = GUN_ID.GENERIC_ASSAULT_RIFLE;
        this.name = "ASSAULT RIFLE";
        
        this.ammoCapacity = 30;
        this.ammo = this.ammoCapacity;
        this.cooldownTime = 66;
        this.attackPower = 5;
        this.reloadTime = 1000; // Ready delay

        this.firingModes = [
            FIRE_MODE.AUTO,
            FIRE_MODE.BURST,
            FIRE_MODE.SEMI_AUTO
        ];

        this.setFireMode(0);
    }
}