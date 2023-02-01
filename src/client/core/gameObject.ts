import Transform from "../../core/transform.js";
import Vector from "../../core/vector.js";
import Camera from "./camera.js";

export default class GameObject extends Transform {
    render(context: CanvasRenderingContext2D, camera: Camera): void {
        const canvasPos: Vector = camera.projectWorldToPixels(this.position);

        //context.setTransform(1, 0, 0, 1, 0, 0); // Identity matrix
        context.resetTransform();
        context.translate(canvasPos.x, canvasPos.y);
        context.rotate(this.rotation);
    }
}
