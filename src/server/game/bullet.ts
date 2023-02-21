import Vector from "../../core/math/vector.js";
import Transform from "../../core/transform.js";
import Zombie from "./zombie.js";
import Circle from "../../core/geometry/circle.js";
import Line from "../../core/geometry/line.js";
import BulletModel from "../../model/bullet.js";
import INetworkObject from "../networkObject.js";

export default class Bullet extends Transform implements INetworkObject {
    public endPosition: Vector;
    private maxDistance: number = 8;

    constructor(position: Vector, direction: Vector, zombies: Zombie[]) {
        super(position);

        this.setDirection(direction);

        // Project trajectory
        this.endPosition = {
            x: (position.x + (direction.x * this.maxDistance)),
            y: (position.y + (direction.y * this.maxDistance)),
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

    toModel(): BulletModel {
        const payload: BulletModel = {
            position: this.position,
            rotation: this.rotation,
            direction: this.direction,
            endPosition: this.endPosition
        }

        return payload;
    }
}