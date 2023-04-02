import Vector, { VectorZero } from "../../core/math/vector";
import Transform from "../../core/transform";
import Zombie from "./zombie";
import Line from "../../core/geometry/line";
import INetworkObject from "../networkObject";
import BulletModel from "../../model/bullet";
import { getNearestGameObjectFromVector } from "../utils/getNearest";

export default class Bullet extends Transform implements INetworkObject {
    private endPosition: Vector = VectorZero();
    private maxDistance: number = 8;

    public get collider(): Line { 
        return {
            start: this.position, 
            end: this.endPosition
        } 
    };

    constructor(position: Vector, direction: Vector) {
        super(position);

        this.setDirection(direction);
    }

    collisionCheck(zombies: Zombie[]): Zombie | null {
        // Project trajectory
        this.endPosition = {
            x: (this.position.x + (this.direction.x * this.maxDistance)),
            y: (this.position.y + (this.direction.y * this.maxDistance)),
        }

        // Zombie vs Bullet hit-test
        const zombiesHit: Zombie[] = zombies.filter((zombie) => Line.intersectsCircle(this.collider, zombie.collider.collider));
        const nearestZombieHit = getNearestGameObjectFromVector(zombiesHit, this.position);

        if(nearestZombieHit) {
            // Reposition bullet
            this.endPosition  = nearestZombieHit.transform.position;

            return nearestZombieHit;
        }

        return null;
    }

    getEndPosition(): Vector {
        return this.endPosition;
    }

    toModel(): BulletModel {
        return {
            transform: {
                position: this.position,
                rotation: this.rotation,
                direction: this.direction
            },
            endPosition: this.endPosition
        };
    }
}