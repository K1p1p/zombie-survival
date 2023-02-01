import Vector, { VectorZero } from "../../../core/vector.js";
import Coordinates from "../coordinates.js";

export default class Camera {
    private static canvas: HTMLCanvasElement;
    public static position: Vector;

    public static init(canvas: HTMLCanvasElement, position: Vector = VectorZero()) {
        Camera.canvas = canvas;
        Camera.position = position;
    }

    /** Assumes canvas matrix is identity */
    public static projectWorldToPixels(meterVector: Vector): Vector {
        // Vector projected from camera(world coordinates) to pixel coordinates
        const output: Vector = Coordinates.worldToPixels({ 
            x: (meterVector.x - Camera.position.x), 
            y: (meterVector.y - Camera.position.y) 
        });

        // Camera centered in canvas
        output.x += Camera.canvas.width / 2;
        output.y += Camera.canvas.height / 2;

        return output;
    }

    public static projectScreenToPixels(screenVector: Vector): Vector {
        return screenVector;
    }

    public static projectScreenToWorld(pixelVector: Vector): Vector {
        const output: Vector = Coordinates.pixelsToWorld({
            x: (pixelVector.x - (Camera.canvas.width / 2)),
            y: (pixelVector.y - (Camera.canvas.height / 2)),
        });

        // Add camera offset position
        output.x += Camera.position.x;
        output.y += Camera.position.y;

        return output;
    }
}