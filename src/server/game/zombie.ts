import Transform from "../../core/transform.js";
import Vector from "../../core/math/vector.js";
import INetworkObject from "../networkObject.js";
import ZombieModel from "../../model/zombie";
import Entity from "../../dto/entity";
import Circle from "../../core/geometry/circle.js";

// Common zombie
export default class Zombie extends Transform implements INetworkObject {
    public id: string = ("zombie:" + Math.random() * Number.MAX_SAFE_INTEGER);
    public maxHealth: number = 2;
    public health: number = this.maxHealth;
    public attackPower: number = 1;
    public get collider(): Circle { 
        return {
            position: this.position,
            radius: 0.1
        } 
    };

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
                health: this.health,
                maxHealth: this.maxHealth,
                speed: this.speed,
                transform: {
                    position: this.position,
                    rotation: this.rotation,
                    direction: this.direction
                }
            }
        }
    }
}