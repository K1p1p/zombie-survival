import Vector from "../../core/vector";

export default class Camera {
    canvas: HTMLCanvasElement;

    size: number;
    position: Vector;

    canvasCenter: Vector;

    constructor(canvas: HTMLCanvasElement, x: number, y: number, size: number) {
        this.canvas = canvas;
        this.size = size;
        this.position = {
            x: x,
            y: y
        }

        this.canvasCenter = {
            x: (canvas.width / 2),
            y: (canvas.height / 2),
        }
    }

    projectVector(vector: Vector): Vector {
        const pixelsPerMeter: number = 100;

        const output: Vector = { x: 0, y: 0 }

        // Center in canvas
        output.x = this.canvasCenter.x;
        output.y = this.canvasCenter.y;

        // Vector projected from camera to canvas
        output.x += (vector.x - this.position.x) * pixelsPerMeter;
        output.y += (vector.y - this.position.y) * pixelsPerMeter;

        return output;
    }
}