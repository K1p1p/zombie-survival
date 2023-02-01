import Camera from "../core/game/camera.js";
import GameObject from "../core/game/gameObject.js";
import Mouse from "../core/input/mouse.js";

export default class Character extends GameObject {
    update(deltaTime: number) {
        const mousePos = Camera.projectScreenToWorld(Mouse.getScreenPosition());
        this.rotation = Math.atan2(-(mousePos.y - this.position.y), (mousePos.x - this.position.x));
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