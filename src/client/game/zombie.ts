import GameObject from "../../core/browser/game/gameObject.js";
import Vector from "../../core/vector.js";
import { normalize } from "../../core/vectorMath.js";
import Character from "./character.js";

export default class Zombie extends GameObject {
    update(deltaTime: number, player: Character) {
        this.lookAt(player.position);

        const normalizedDir: Vector = normalize(this.direction);
        const speed = 0.5;
        const step = (speed * deltaTime);

        this.translate({
            x: (normalizedDir.x * step),
            y: (normalizedDir.y * step),
        })
    }

    render(context: CanvasRenderingContext2D): void {
        super.render(context);

        const size: number = 5;

        context.lineWidth = (size - 3);
        context.fillStyle = "red";
        context.strokeStyle = "red";

        context.beginPath();
        context.moveTo(0, size)
        context.lineTo(10, size);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.moveTo(0, -size)
        context.lineTo(10, -size);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.arc(0, 0, size, 0, (2 * Math.PI));
        context.fill();
        context.closePath();
    }
}