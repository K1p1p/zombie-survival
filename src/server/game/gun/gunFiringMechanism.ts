import { FIRE_MODE } from "../../../model/gun";

export class GunFiringMechanism {
    private fireMode!: FIRE_MODE;

    private isShooting: boolean = false;
    private bulletsShotAfterTriggerPull: number = 0;
    private bulletsToShootAfterTriggerPull: number = 0;

    constructor(fireMode: FIRE_MODE) {
        this.setFireMode(fireMode);
    }

    public setFireMode(fireMode: FIRE_MODE) {
        this.fireMode = fireMode;

        switch (fireMode) {
            case FIRE_MODE.AUTO: this.bulletsToShootAfterTriggerPull = Number.POSITIVE_INFINITY; break;
            case FIRE_MODE.BURST: this.bulletsToShootAfterTriggerPull = 3; break;
            case FIRE_MODE.SEMI_AUTO: this.bulletsToShootAfterTriggerPull = 1; break;
        }
    }

    public onTriggerPull() {
        if (this.isShooting) { return; }

        this.isShooting = true;
        this.bulletsShotAfterTriggerPull = 0;
    }

    public onTriggerRelease() {
        if (!this.isShooting) { return; }

        // Stop auto shooting
        if (this.fireMode === FIRE_MODE.AUTO) {
            this.reset();
        }
    }

    /**
     * Updates the firing mechanism
     * @returns wheter or not fire bullet.
     */
    public update(): boolean {
        if (!this.isShooting) {
            this.reset();
            return false;
        }

        this.bulletsShotAfterTriggerPull += 1;

        if (this.bulletsShotAfterTriggerPull >= this.bulletsToShootAfterTriggerPull) {
            this.reset();
        }

        return true;
    }

    public reset() {
        this.isShooting = false;
        this.bulletsShotAfterTriggerPull = 0;
    }
}