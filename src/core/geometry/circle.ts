import Vector from "../math/vector";
import Line from "./line";

export default class Circle {
    radius: number;
    position: Vector;

    constructor(position: Vector, radius: number) {
        this.radius = radius;
        this.position = position;
    }

    public static intersectsVector(sphere: Circle, vector: Vector): boolean {
        const distance: number = Vector.magnitude({
            x: sphere.position.x - vector.x,
            y: sphere.position.y - vector.y,
        });

        return (sphere.radius >= distance);
    }

    public static intersectsLine(line: Line, circle: Circle): boolean {
        return Line.intersectsCircle(line, circle);
    }

    public static intersectsSphere(a: Circle, b: Circle): boolean {
        const distance: number = Vector.magnitude({
            x: a.position.x - b.position.x,
            y: a.position.y - b.position.y,
        });

        return ((a.radius + b.radius) >= distance);
    }
}