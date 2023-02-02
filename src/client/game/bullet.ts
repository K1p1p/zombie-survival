import Camera from "../../core/browser/game/camera.js";
import GameObject from "../../core/browser/game/gameObject.js";
import Circle from "../../core/geometry/circle.js";
import Line from "../../core/geometry/line.js";
import Vector from "../../core/math/vector.js";
import Zombie from "./zombie.js";

export class Bullet extends GameObject {
    private endPosition: Vector;

    constructor(position: Vector, direction: Vector, maxDistance: number, zombies: Zombie[]) {
        super(position);

        this.setDirection(direction);

        // Project trajectory
        this.endPosition = {
            x: (position.x + (direction.x * maxDistance)),
            y: (position.y + (direction.y * maxDistance)),
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

    render(context: CanvasRenderingContext2D): void {
        super.render(context);

        const start: Vector = Camera.projectWorldToPixels(this.position);
        const end: Vector = Camera.projectWorldToPixels(this.endPosition);
        const length = Vector.magnitude({ x: (end.x - start.x), y: (end.y - start.y) })
        
        context.lineWidth = 2;
        context.strokeStyle = "orange";

        context.beginPath();
        context.moveTo(0, 0)
        context.lineTo(length, 0);
        context.stroke();
        context.closePath();
    }
}