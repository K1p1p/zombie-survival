import { FIRE_MODE, GUN_ID } from "../../../../model/gun";
import GameObject from "../../gameObject";
import Gun from "../gun";

export default class Pistol extends Gun {
    constructor(wielder: GameObject) {
        super(wielder);

        this.id = GUN_ID.GENERIC_PISTOL;
        this.name = "PISTOL";
        
        this.ammoCapacity = 15;
        this.ammo = this.ammoCapacity;
        this.cooldownTime = 500;
        this.attackPower = 3.5;
        this.reloadTime = 500; // Ready delay

        this.firingModes = [
            FIRE_MODE.AUTO,
            FIRE_MODE.SEMI_AUTO
        ];

        this.setFireMode(0);
    }
}