import GameObject from "../../core/browser/game/gameObject.js";
import TransformModel from "../../model/transform.js";

export default class Zombie extends GameObject {
    constructor(data: TransformModel) {
        super(data.position, data.rotation, data.direction);
    }

    render(context: CanvasRenderingContext2D): void {
        super.render(context);

        const size: number = 5;

        context.lineWidth = (size - 3);
        context.fillStyle = "red";
        context.strokeStyle = "red";

        context.beginPath();
        context.moveTo(0, size)
        context.lineTo((size * 2), size);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.moveTo(0, -size)
        context.lineTo((size * 2), -size);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.arc(0, 0, size, 0, (2 * Math.PI));
        context.fill();
        context.closePath();
    }
}