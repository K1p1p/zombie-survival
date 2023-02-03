import GameObject from "../../core/browser/game/gameObject.js";

export default class CoordinateText extends GameObject {
    render(context: CanvasRenderingContext2D): void {
        super.render(context);

        context.font = "12px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillStyle = "black";
        context.fillText(`(${this.position.x.toFixed(1)}, ${this.position.y.toFixed(1)})`, 0, 0);
    }
}