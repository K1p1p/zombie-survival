import Vector, { VectorZero } from "./vector.js";

export function moveTowards(current: Vector, target: Vector, maxDelta) {
    const deltaX = (target.x - current.x);
    const deltaY = (target.y - current.y);
    const magnitude = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));

    if (magnitude <= maxDelta || magnitude == 0) { return target; }

    return {
        x: current.x + deltaX / magnitude * maxDelta,
        y: current.y + deltaY / magnitude * maxDelta,
    }
}

export function magnitude(vector: Vector): number {
    return (Math.abs(vector.x) + Math.abs(vector.y));
    // return Math.sqrt((vector.x * vector.x) + (vector.y * vector.y)); // SAME THING ???
}

export function normalize(vector: Vector): Vector {
    const mag: number = magnitude(vector);

    if(mag === 0) { return VectorZero(); }

    return {
        x: (vector.x / mag),
        y: (vector.y / mag)
    }
}