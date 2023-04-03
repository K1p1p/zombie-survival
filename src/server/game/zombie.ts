import Vector from "../../core/math/vector";
import ZombieModel from "../../model/zombie";
import Entity from "../../dto/entity";
import GameObject from "./gameObject";
import Player from "./player";
import { getNearestGameObjectFromVector } from "../utils/getNearest";
import Circle from "../../core/geometry/circle";

// Common zombie
export default class Zombie extends GameObject {
    public id: string = ("zombie:" + Math.random() * Number.MAX_SAFE_INTEGER);
    public maxHealth: number = 10;
    public health: number = this.maxHealth;
    public attackPower: number = 5;

    protected speed: number = 0.5;

    constructor(position: Vector) {
        super();

        this.transform.position = position;
    }

    update(deltaTime: number, players: Player[]) {
        const nearestPlayer: Player | null = getNearestGameObjectFromVector(players, this.transform.position);

        if(!nearestPlayer) { return; }

        this.transform.lookAt(nearestPlayer.transform.position);

        const normalizedDir: Vector = Vector.normalize(this.transform.direction);
        const speed = 0.5;
        const step = (speed * deltaTime);

        this.transform.translate({
            x: (normalizedDir.x * step),
            y: (normalizedDir.y * step),
        });

        // Check collision with player, then damages it
        if (Circle.intersectsSphere(this.collider.collider, nearestPlayer.collider.collider)) {
            nearestPlayer.health -= (this.attackPower * deltaTime);
        }
    }

    toModel(): Entity<ZombieModel> {
        return {
            id: this.id,
            data: {
                health: this.health,
                maxHealth: this.maxHealth,
                speed: this.speed,
                transform: {
                    position: this.transform.position,
                    rotation: this.transform.rotation,
                    direction: this.transform.direction
                }
            }
        }
    }
}