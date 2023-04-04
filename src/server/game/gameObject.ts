import Transform from "../../core/transform";
import INetworkObject from "../networkObject";
import CircleCollider from "./circleCollider";

export default abstract class GameObject implements INetworkObject {
    public abstract id: string;

    public transform: Transform;
    //public rigidbody: Rigidbody;

    public collider: CircleCollider;

    public maxHealth: number = 100;
    public health: number = this.maxHealth;
    public get isAlive(): boolean { return this.health > 0 }

    constructor() {
        this.transform = new Transform();
        this.collider = new CircleCollider(this.transform);
    }
    
    abstract toModel(): any
}