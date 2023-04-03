import Vector from "../../core/math/vector";
import GunModel, { GUN_ID } from "../../model/gun";
import ModelStateHandler from "../modelStateHandler";
import SoundManager from "./soundManager";

export default class Gun {
    public state: ModelStateHandler<GunModel>;

    constructor(data: GunModel) {
        this.state = new ModelStateHandler<GunModel>(data);
    }

    public updateState(newState: GunModel, position: Vector) {
        this.state.setState(newState);

        // Finished reloading
        if(!this.state.current.isReloading && this.state.last.isReloading) {
            SoundManager.playReload(position);
        }
    }

    public getAmmo() : number {
        return this.state.current.ammo;
    }

    public render(positionInPlayerMatrix: Vector, context: CanvasRenderingContext2D) {
        context.lineWidth = 2;
        context.fillStyle = "black";
        context.strokeStyle = "black";

        context.beginPath();
        context.moveTo(positionInPlayerMatrix.x, positionInPlayerMatrix.y);

        switch(this.state.current.id) {
            case GUN_ID.GENERIC_PISTOL: context.lineTo(10, 0); break;
            case GUN_ID.GENERIC_ASSAULT_RIFLE: context.lineTo(20, 0); break;
        }
        
        context.stroke();
        context.closePath();
    }
}