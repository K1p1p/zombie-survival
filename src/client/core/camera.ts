import Vector from "../../core/vector.js";
import World from "./world/world.js";

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
        // Vector projected from camera to canvas
        const output: Vector = World.screenToWorld({ 
            x: (vector.x - this.position.x), 
            y: (vector.y - this.position.y) 
        });

        // Center in canvas
        output.x += this.canvasCenter.x;
        output.y += this.canvasCenter.y;

        return output;
    }
}