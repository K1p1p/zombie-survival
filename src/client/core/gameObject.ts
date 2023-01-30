import Vector, { VectorZero } from "../../core/vector.js";
import Camera from "./camera.js";

export default class GameObject {
    position: Vector;
    rotation: number; // Angle
    direction: Vector;

    constructor(position: Vector, rotation: number = 0, direction: Vector = VectorZero()) {
        this.position = position;
        this.rotation = rotation;
        this.direction = direction;
    }

    render(context: CanvasRenderingContext2D, camera: Camera): void {
        const canvasPos: Vector = camera.projectWorldToPixels(this.position);

        context.setTransform(1, 0, 0, 1, 0, 0); // Identity matrix
        context.rotate(this.rotation);
        context.translate(canvasPos.x, canvasPos.y);
    }
}
