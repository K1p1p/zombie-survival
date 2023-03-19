import Vector from "../../core/math/vector.js";
import Character from "./character.js";
import TransformModel from "../../dto/transform.js";
import { PlayerActionBuffer } from "../index.js";

export default class Player extends Character {
    protected id: string;
    public get uuid(): string { return this.uuid; }

    protected hp: number = 1;
    protected speed: number = 1;

    constructor(uuid: string, position: Vector, rotation?: number, direction?: Vector) {
        super(position, rotation, direction);

        this.id = uuid;
    }

    update(deltaTime: number, playerActionBuffer: PlayerActionBuffer) {
        const normalizedDir: Vector = Vector.normalize(playerActionBuffer.moveDirection);
        const step = (this.speed * deltaTime);
    
        this.translate({
            x: (normalizedDir.x * step),
            y: (normalizedDir.y * step),
        })

        this.rotation = playerActionBuffer.rotation;
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