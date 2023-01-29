export default interface Vector {
    x: number;
    y: number;
}

export function VectorZero(): Vector {
    return { x: 0, y: 0 };
}