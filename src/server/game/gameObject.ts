import Transform from "../../core/transform";
import INetworkObject from "../networkObject";
import CircleCollider from "./circleCollider";

export default abstract class GameObject implements INetworkObject {
    public transform: Transform;
    //public rigidbody: Rigidbody;

    public collider: CircleCollider;

    constructor() {
        this.transform = new Transform();
        this.collider = new CircleCollider(this.transform);
    }
    
    abstract toModel(): any
}