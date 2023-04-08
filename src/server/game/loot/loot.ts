import Transform from "../../../core/transform";
import INetworkObject from "../../networkObject";
import CircleCollider from "../circleCollider";
import Player from "../player/player";

export default abstract class Loot implements INetworkObject {
    public entityId: string = ("loot:" + Math.random() * Number.MAX_SAFE_INTEGER);

    public transform: Transform = new Transform();
    public collider: CircleCollider = new CircleCollider(this.transform, 0.1);

    /**
     * Try to use/pickup this loot
     * @param player Target player.
     * @returns The action success/failure.
     */
    abstract use(player: Player): boolean;

    abstract toModel(): any;
}

