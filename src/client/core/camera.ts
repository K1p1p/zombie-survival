import Vector from "../../core/vector.js";
import Coordinates from "./coordinates.js";

export default class Camera {
    canvas: HTMLCanvasElement;

    size: number;
    position: Vector;

    canvasPixelsToCenter: Vector;

    constructor(canvas: HTMLCanvasElement, x: number, y: number, size: number) {
        this.canvas = canvas;
        this.size = size;
        this.position = {
            x: x,
            y: y
        }

        this.canvasPixelsToCenter = {
            x: (canvas.width / 2),
            y: (canvas.height / 2),
        }
    }

    /** Assumes canvas matrix is identity */
    projectWorldToPixels(meterVector: Vector): Vector {
        // Vector projected from camera(world coordinates) to pixel coordinates
        const output: Vector = Coordinates.worldToPixels({ 
            x: (meterVector.x - this.position.x), 
            y: (meterVector.y - this.position.y) 
        });

        // Camera centered in canvas
        output.x += this.canvasPixelsToCenter.x;
        output.y += this.canvasPixelsToCenter.y;

        return output;
    }

    projectScreenToPixels(screenVector: Vector): Vector {
        return screenVector;
    }

    projectScreenToWorld(pixelVector: Vector): Vector {
        const output: Vector = Coordinates.pixelsToWorld({
            x: (pixelVector.x - this.canvasPixelsToCenter.x),
            y: (pixelVector.y - this.canvasPixelsToCenter.y),
        });

        // Add camera offset position
        output.x += this.position.x;
        output.y += this.position.y;

        return output;
    }
}