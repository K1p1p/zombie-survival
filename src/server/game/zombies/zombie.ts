import Vector from "../../../core/math/vector";
import ZombieModel from "../../../model/zombie";
import Entity from "../../../dto/entity";
import GameObject from "../gameObject";
import Player from "../player/player";
import { getNearestGameObjectFromVector } from "../../utils/getNearest";
import Circle from "../../../core/geometry/circle";

export default abstract class Zombie extends GameObject {
    public entityId: string = ("zombie:" + Math.random() * Number.MAX_SAFE_INTEGER);
    public attackPower: number = 5;
    public color: string = "red";
    public size: number = 0.1;
    public threatValue: number = 1;

    protected speed: number = 0.5;

    constructor(position: Vector) {
        super();

        this.transform.position = position;
    }

    protected loadBaseStats() {
        this.health = this.maxHealth;
        this.collider.setSize(this.size);
    }

    update(deltaTime: number, players: Player[]) {
        const alivePlayers: Player[] = players.filter((player) => player.isAlive);
        const nearestPlayer: Player | null = getNearestGameObjectFromVector(alivePlayers, this.transform.position);

        if(!nearestPlayer) { return; }

        this.transform.lookAt(nearestPlayer.transform.position);

        const normalizedDir: Vector = Vector.normalize(this.transform.direction);
        const step = (this.speed * deltaTime);

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
            id: this.entityId,
            data: {
                size: this.size,
                color: this.color,
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