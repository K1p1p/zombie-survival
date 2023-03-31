import Transform from "../../../core/transform";
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
    }
}