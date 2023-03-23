import Vector, { VectorZero } from "../../core/math/vector.js";
import Character from "./character.js";
import Gun from "./gun.js";
import Bullet from "./bullet.js";
import PlayerModel from "../../dto/player";
import PlayerActionRequestModel from "../../dto/playerActionRequest.js";
import MockServer from "../index.js";

export default class Player extends Character {
    public id: string = ("player:" + Math.random() * Number.MAX_SAFE_INTEGER);

    protected speed: number = 1;
    protected gun: Gun;

    private actionBuffer: PlayerActionRequestModel = {
        moveDirection: VectorZero(),
        rotation: 0,
        shoot: false,
        reload: false
    }

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

    update(deltaTime: number, server: MockServer) {
        const normalizedDir: Vector = Vector.normalize(this.actionBuffer.moveDirection);
        const step = (this.speed * deltaTime);
    
        this.translate({
            x: (normalizedDir.x * step),
            y: (normalizedDir.y * step),
        })

        this.rotation = this.actionBuffer.rotation;

        if(this.actionBuffer.shoot) { server.createBullet(this.shoot()); }
        if(this.actionBuffer.reload) { this.reload(); }

        this.resetActionBuffer();
    }

    clientUpdate(data: PlayerActionRequestModel) {
        data.moveDirection = Vector.normalize(data.moveDirection); // Sanitize input

        this.actionBuffer = data;
    }

    toModel(): PlayerModel {
        return {
            id: this.id,
            transform: {
                position: this.position,
                rotation: this.rotation,
                direction: this.direction
            },
            gun: this.gun.toModel()
        };
    }

    private resetActionBuffer() {
        this.actionBuffer.moveDirection = VectorZero();
        //this.actionBuffer.rotation = DO_NOT_CHANGE; // Keep rotation! Otherwise player rotates to zero when not moving!
        this.actionBuffer.shoot = false;
        this.actionBuffer.reload = false;
    }
}