import Vector from "../../core/math/vector.js";
import Transform from "../../core/transform.js";
import Zombie from "./zombie.js";
import Line from "../../core/geometry/line.js";
import INetworkObject from "../networkObject.js";
import BulletModel from "../../model/bullet";

export default class Bullet extends Transform implements INetworkObject {
    private endPosition: Vector;
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

    collisionCheck(zombies: Zombie[]): { zombie: Zombie, zombieIndex: number} {
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
            if(Line.intersectsCircle(this.collider, zombie.collider)) {
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
            // Reposition bullet
            this.endPosition  = zombieHit.position;

            return {
                zombie: zombieHit,
                zombieIndex: zombieHitIndex
            };
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