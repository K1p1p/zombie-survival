export enum TRIGGER_STATE {
    RELEASED = "RELEASED",
    ON_PULL = "ON_PULL",
    HOLD = "HOLD",
    ON_RELEASE = "ON_RELEASE"
}

export class GunTrigger {
    public state: TRIGGER_STATE = TRIGGER_STATE.RELEASED;

    public update(shoot: boolean) {
        if(shoot) {
            switch(this.state) {
                case TRIGGER_STATE.RELEASED: this.state = TRIGGER_STATE.ON_PULL; break;
                case TRIGGER_STATE.ON_PULL: this.state = TRIGGER_STATE.HOLD; break;
                case TRIGGER_STATE.HOLD: break;
                default: this.state = TRIGGER_STATE.ON_PULL; break;
            }
        } else {
            switch(this.state) {
                case TRIGGER_STATE.HOLD: this.state = TRIGGER_STATE.ON_RELEASE; break;
                case TRIGGER_STATE.ON_RELEASE: this.state = TRIGGER_STATE.RELEASED; break;
                case TRIGGER_STATE.RELEASED: break;
                default: this.state = TRIGGER_STATE.ON_RELEASE; break;
            }
        }
    }

    public reset() {
        this.state = TRIGGER_STATE.RELEASED;
    }
}