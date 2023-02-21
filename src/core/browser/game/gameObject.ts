import Transform from "../../transform.js";
import Vector from "../../math/vector.js";
import Camera from "./camera.js";

export default abstract class GameObject extends Transform {
    render(context: CanvasRenderingContext2D): void {
        const canvasPos: Vector = Camera.projectWorldToPixels(this.position);

        //context.setTransform(1, 0, 0, 1, 0, 0); // Identity matrix
        context.resetTransform();
        context.translate(canvasPos.x, canvasPos.y);
        context.rotate(this.rotation);
    }
}
