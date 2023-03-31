import Transform from "../../../core/transform";
import Gun from "../gun";

export default class Pistol extends Gun {
    constructor(wielderTransform: Transform) {
        super(wielderTransform);

        this.name = "PISTOL";
        this.ammoCapacity = 15;
        this.ammo = this.ammoCapacity;
        this.cooldownTime = 500;
        this.attackPower = 34;
        this.reloadTime = 500; // Ready delay
    }
}