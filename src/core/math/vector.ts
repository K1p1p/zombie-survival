export default class Vector {
    x: number = 0;
    y: number = 0;

    public static moveTowards(current: Vector, target: Vector, maxDelta: number): Vector {
        const deltaX = (target.x - current.x);
        const deltaY = (target.y - current.y);
        const magnitude = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
    
        if (magnitude <= maxDelta || magnitude == 0) { return target; }
    
        return {
            x: current.x + deltaX / magnitude * maxDelta,
            y: current.y + deltaY / magnitude * maxDelta,
        }
    }
    
    public static magnitude(vector: Vector): number {
        return Math.sqrt((vector.x * vector.x) + (vector.y * vector.y)); 
    }
    
    public static normalize(vector: Vector): Vector {
        const mag: number = Vector.magnitude(vector);
    
        if(mag === 0) { return VectorZero(); }
    
        return {
            x: (vector.x / mag),
            y: (vector.y / mag)
        }
    }

    public static distance(to: Vector, from: Vector): number {
        return Vector.magnitude(Vector.delta(to, from));
    }

    public static delta(to: Vector, from: Vector): Vector {
        return {
            x: (to.x - from.x),
            y: (to.y - from.y),
        }
    }
}

export function VectorZero(): Vector {
    return { x: 0, y: 0 };
}