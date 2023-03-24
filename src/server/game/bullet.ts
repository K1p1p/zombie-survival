import Vector from "../../core/math/vector.js";
import Transform from "../../core/transform.js";
import Zombie from "./zombie.js";
import Circle from "../../core/geometry/circle.js";
import Line from "../../core/geometry/line.js";
import INetworkObject from "../networkObject.js";
import BulletModel from "../../model/bullet";

export default class Bullet extends Transform implements INetworkObject {
    private endPosition: Vector;
    private maxDistance: number = 8;

    constructor(position: Vector, direction: Vector) {
        super(position);

        this.setDirection(direction);
    }

    collisionCheck(zombies: Zombie[]) {
        // Project trajectory
        this.endPosition = {
            x: (this.position.x + (this.direction.x * this.maxDistance)),
            y: (this.position.y + (this.direction.y * this.maxDistance)),
        }

        // Zombie vs Bullet hit-test
        let zombieHit: (Zombie | null) = null;
        let zombieHitIndex: number = 0;
        let zombieHitDistance: number = Number.POSITIVE_INFINITY;
        zombies.forEach((zombie, index) => {
            const collider: Circle = {
                position: zombie.position, 
                radius: 0.1
            }

            const bulletCollider: Line = {
                start: this.position, 
                end: this.endPosition
            }

            if(Line.intersectsCircle(bulletCollider, collider)) {
                const distanceFromBullet: number = Vector.magnitude({ 
                    x: (zombie.position.x - this.position.x),
                    y: (zombie.position.y - this.position.y),
                });

                // Hit only the nearest zombie
                if(distanceFromBullet < zombieHitDistance) {
                    zombieHit = zombie;
                    zombieHitIndex = index;
                    zombieHitDistance = distanceFromBullet;
                }
            }
        });

        if(zombieHit) {
            // Destroy zombie
            zombies.splice(zombieHitIndex, 1); 

            // Reposition bullet
            this.endPosition  = zombieHit.position;
        }
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