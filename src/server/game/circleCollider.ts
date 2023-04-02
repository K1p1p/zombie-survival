import Transform from "../../core/transform";
import Circle from "../../core/geometry/circle";

export default class CircleCollider {
    private radius: number;
    private transform: Transform;

    //private collider: Circle;

    public get collider(): Circle { 
        return {
            position: this.transform.position,
            radius: this.radius
        } 
    };

    constructor(transform: Transform, radius: number=0.1) {
        this.radius = radius;
        this.transform = transform;
    }
}