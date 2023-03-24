import Transform from "../../core/transform.js";
import Vector from "../../core/math/vector.js";
import INetworkObject from "../networkObject.js";
import ZombieModel from "../../model/zombie";
import Entity from "../../dto/entity";

// Common zombie
export default class Zombie extends Transform implements INetworkObject {
    public id: string = ("zombie:" + Math.random() * Number.MAX_SAFE_INTEGER);

    protected speed: number = 0.5;

    update(deltaTime: number, player?: Transform) {
        if(!player) { return; }

        this.lookAt(player.position);

        const normalizedDir: Vector = Vector.normalize(this.direction);
        const speed = 0.5;
        const step = (speed * deltaTime);

        this.translate({
            x: (normalizedDir.x * step),
            y: (normalizedDir.y * step),
        })
    }

    toModel(): Entity<ZombieModel> {
        return {
            id: this.id,
            data: {
                transform: {
                    position: this.position,
                    rotation: this.rotation,
                    direction: this.direction
                }
            }
        }
    }
}