import Transform from "../../core/transform";
import Circle from "../../core/geometry/circle";

export default class CircleCollider {
    private radius: number;
    private transform: Transform;

    public get collider(): Circle { 
        return {
            position: this.transform.position,
            radius: this.radius
        } 
    };

    constructor(transform: Transform, radius: number=1) {
        this.radius = radius;
        this.transform = transform;
    }

    public setSize(radius: number) {
        this.radius = radius;
    }
}