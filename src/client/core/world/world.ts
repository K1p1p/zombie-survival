import Vector from "../../../core/vector.js";

class World {
    private static pixelsPerMeter: number = 100;

    /** Get value scaled to world */
    public static screenToWorldScale(value: number) {
        return (value * World.pixelsPerMeter);
    }

    /** Get world position of vector */
    public static screenToWorld(position: Vector) {
        return {
            x: World.screenToWorldScale(position.x),
            y: World.screenToWorldScale(position.y),
        }
    }
}

export default World;