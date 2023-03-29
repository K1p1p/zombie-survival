import Transform from "../../transform";
import Vector from "../../math/vector";
import Camera from "./camera";

export default abstract class GameObject extends Transform {
    render(context: CanvasRenderingContext2D): void {
        const canvasPos: Vector = Camera.projectWorldToPixels(this.position);

        //context.setTransform(1, 0, 0, 1, 0, 0); // Identity matrix
        context.resetTransform();
        context.translate(canvasPos.x, canvasPos.y);
        context.rotate(this.rotation);
    }
}
