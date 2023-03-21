import Vector from "../../core/math/vector.js";
import Character from "./character.js";
import { PlayerActionBuffer } from "../index.js";
import Gun from "./gun.js";
import Bullet from "./bullet.js";
import PlayerModel from "../../dto/player";

export default class Player extends Character {
    protected id: string;
    public get uuid(): string { return this.uuid; }

    protected speed: number = 1;
    protected gun: Gun;

    constructor(uuid: string, position: Vector, rotation?: number, direction?: Vector) {
        super(position, rotation, direction);

        this.id = uuid;
        this.gun = new Gun(this);
    }

    shoot(): (Bullet | null) {
        return this.gun.shoot();
    }

    reload() {
        this.gun.reload();
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

    toModel(): PlayerModel {
        return {
            transform: {
                position: this.position,
                rotation: this.rotation,
                direction: this.direction
            },
            gun: this.gun.toModel()
        };
    }
}