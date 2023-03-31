import Transform from "../../../../core/transform";
import { FIRE_MODE } from "../../../../model/gun";
import Gun from "../gun";

export default class SMG extends Gun {
    constructor(wielderTransform: Transform) {
        super(wielderTransform);

        this.name = "SMG";
        this.ammoCapacity = 30;
        this.ammo = this.ammoCapacity;
        this.cooldownTime = 66;
        this.attackPower = 33;
        this.reloadTime = 1000; // Ready delay

        this.firingModes = [
            FIRE_MODE.AUTO,
            FIRE_MODE.BURST,
            FIRE_MODE.SEMI_AUTO
        ];

        this.setFireMode(0);
    }
}