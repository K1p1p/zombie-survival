import Vector, { VectorZero } from "../../core/math/vector";
import Transform from "../../core/transform";
import Line from "../../core/geometry/line";
import INetworkObject from "../networkObject";
import BulletModel from "../../model/bullet";
import { getNearestGameObjectFromVector } from "../utils/getNearest";
import GameObject from "./gameObject";

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

    collisionCheck(creator: GameObject, targets: GameObject[]): GameObject | null {
        // Project trajectory
        this.endPosition = {
            x: (this.position.x + (this.direction.x * this.maxDistance)),
            y: (this.position.y + (this.direction.y * this.maxDistance)),
        }

        // Gameobject vs Bullet hit-test (Excluding bullet creator)
        const hit: GameObject[] = targets.filter((gameobject) => (creator !== gameobject) && Line.intersectsCircle(this.collider, gameobject.collider.collider));
        const nearestHit = getNearestGameObjectFromVector(hit, this.position);

        if(nearestHit) {
            // Reposition bullet
            this.endPosition  = nearestHit.transform.position;

            return nearestHit;
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