import Vector from "../../core/math/vector.js";
import Character from "./character.js";
import Gun from "./gun.js";
import Bullet from "./bullet.js";
import PlayerModel from "../../dto/player";
import PlayerActionRequestModel from "../../dto/playerActionRequest.js";

export default class Player extends Character {
    public id: string = ("player:" + Math.random() * Number.MAX_SAFE_INTEGER);

    protected speed: number = 1;
    protected gun: Gun;

    constructor(position: Vector, rotation?: number, direction?: Vector) {
        super(position, rotation, direction);

        this.gun = new Gun(this);
    }

    shoot(): (Bullet | null) {
        return this.gun.shoot();
    }

    reload() {
        this.gun.reload();
    }

    update(deltaTime: number, data: PlayerActionRequestModel) {
        const normalizedDir: Vector = Vector.normalize(data.moveDirection);
        const step = (this.speed * deltaTime);
    
        this.translate({
            x: (normalizedDir.x * step),
            y: (normalizedDir.y * step),
        })

        this.rotation = data.rotation;
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