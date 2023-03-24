import Vector, { VectorZero } from "../../core/math/vector.js";
import Gun from "./gun.js";
import Bullet from "./bullet.js";
import MockServer from "../index.js";
import INetworkObject from "../networkObject.js";
import Transform from "../../core/transform.js";
import PlayerModel from "../../model/player";
import { ClientPlayerAction } from "../../dto/clientAction";

export default class Player extends Transform implements INetworkObject {
    public id: string = ("player:" + Math.random() * Number.MAX_SAFE_INTEGER);

    protected speed: number = 1;
    protected gun: Gun;

    private actionBuffer: ClientPlayerAction = {
        moveDirection: VectorZero(),
        rotation: 0,
        shoot: false,
        reload: false
    }

    constructor(position?: Vector, rotation?: number, direction?: Vector) {
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

    clientUpdate(data: ClientPlayerAction) {
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