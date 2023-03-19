import Camera from "../../core/browser/game/camera.js";
import GameObject from "../../core/browser/game/gameObject.js";
import Vector from "../../core/math/vector.js";
import BulletModel from "../../dto/bullet.js";
import SoundManager from "./soundManager.js";

export default class Bullet extends GameObject {
    private endPosition: Vector;

    constructor(data: BulletModel) {
        super(data.position, data.rotation, data.direction);

        this.endPosition = data.endPosition;
        
        SoundManager.playGunshot();
    }

    render(context: CanvasRenderingContext2D): void {
        super.render(context);

        const start: Vector = Camera.projectWorldToPixels(this.position);
        const end: Vector = Camera.projectWorldToPixels(this.endPosition);
        const length = Vector.magnitude({ x: (end.x - start.x), y: (end.y - start.y) })
        
        context.lineWidth = 2;
        context.strokeStyle = "orange";

        context.beginPath();
        context.moveTo(0, 0)
        context.lineTo(length, 0);
        context.stroke();
        context.closePath();
    }
}