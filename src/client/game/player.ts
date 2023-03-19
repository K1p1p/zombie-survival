import GameObject from "../../core/browser/game/gameObject.js";
import TransformModel from "../../dto/transform.js";

export default class Player extends GameObject {
    constructor(data: TransformModel) {
        super(data.position, data.rotation, data.direction);
    }

    render(context: CanvasRenderingContext2D): void {
        super.render(context);

        context.lineWidth = 2;
        context.fillStyle = "black";
        context.strokeStyle = "black";

        context.beginPath();
        context.moveTo(0, 0)
        context.lineTo(10, 0);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.arc(0, 0, 5, 0, (2 * Math.PI));
        context.fill();
        context.closePath();
    }
}