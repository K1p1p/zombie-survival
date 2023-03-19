import NPC from "./npc.js";
import Transform from "../../core/transform.js";
import Vector from "../../core/math/vector.js";
import TransformModel from "../../dto/transform.js";

// Common zombie
export default class Zombie extends NPC {
    protected id: string = "zombie_id";

    protected hp: number = 1;
    protected speed: number = 0.5;

    update(deltaTime: number, player: Transform) {
        this.lookAt(player.position);

        const normalizedDir: Vector = Vector.normalize(this.direction);
        const speed = 0.5;
        const step = (speed * deltaTime);

        this.translate({
            x: (normalizedDir.x * step),
            y: (normalizedDir.y * step),
        })
    }

    toModel(): TransformModel {
        const payload: TransformModel = {
            position: this.position,
            rotation: this.rotation,
            direction: this.direction
        }

        return payload;
    }
}