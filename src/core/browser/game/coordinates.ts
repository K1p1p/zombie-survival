import Vector from "../../math/vector.js";

class Coordinates {
    public static pixelsPerMeter: number = Object.freeze(100);

    public static pixelsToWorldScale(value: number) {
        return (value / Coordinates.pixelsPerMeter);
    }

    public static pixelsToWorld(position: Vector) {
        return {
            x:  Coordinates.pixelsToWorldScale(position.x),
            y: -Coordinates.pixelsToWorldScale(position.y), // Y-axis inverted in conversion
        }
    }

    public static worldToPixelsScale(value: number) {
        return (value * Coordinates.pixelsPerMeter);
    }

    public static worldToPixels(position: Vector) {
        return {
            x:  Coordinates.worldToPixelsScale(position.x),
            y: -Coordinates.worldToPixelsScale(position.y), // Y-axis inverted in conversion
        }
    }
}

export default Coordinates;