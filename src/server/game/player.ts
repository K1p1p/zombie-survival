import Vector, { VectorZero } from "../../core/math/vector";
import Gun from "./gun";
import Bullet from "./bullet";
import INetworkObject from "../networkObject";
import Transform from "../../core/transform";
import PlayerModel from "../../model/player";
import { ClientPlayerUpdate } from "../../dto/clientUpdate";
import Entity from "../../dto/entity";
import Circle from "../../core/geometry/circle";
import Server from "../server";
import { loop } from "../../core/math/index";
import Pistol from "./guns/pistol";
import SMG from "./guns/smg";

export default class Player extends Transform implements INetworkObject {
    public webSocketId?: string;

    public nickname: string;

    public id: string = ("player:" + Math.random() * Number.MAX_SAFE_INTEGER);
    public maxHealth: number = 1;
    public health: number = this.maxHealth;
    public get isAlive(): boolean { return this.health > 0 }
    public get collider(): Circle { 
        return {
            position: this.position,
            radius: 0.1
        } 
    };

    public gun: Gun;


    public guns: Gun[];
    public gunIndex: number = 0;

    protected speed: number = 1;

    private actionBuffer: ClientPlayerUpdate = {
        moveDirection: VectorZero(),
        rotation: 0,
        shoot: false,
        reload: false,
        switchGun: false,
        switchGunOffset: 0
    }

    constructor(nickname: string, position?: Vector, rotation?: number, direction?: Vector) {
        super(position, rotation, direction);

        this.nickname = nickname;
        this.guns = [
            new Pistol(this),
            new SMG(this),
        ];
        this.gun = this.guns[this.gunIndex];
    }

    shoot(): (Bullet | null) {
        return this.gun.shoot();
    }

    reload() {
        this.gun.reload();
    }

    update(deltaTime: number, server: Server) {
        if(!this.isAlive) { return; }

        const normalizedDir: Vector = Vector.normalize(this.actionBuffer.moveDirection);
        const step = (this.speed * deltaTime);
    
        this.translate({
            x: (normalizedDir.x * step),
            y: (normalizedDir.y * step),
        })

        this.rotation = this.actionBuffer.rotation;

        if(this.actionBuffer.shoot) { server.createBullet(this.shoot(), this.gun); }
        
        if(this.actionBuffer.reload) { this.reload(); }

        if(this.actionBuffer.switchGun) { 
            this.gunIndex = loop(this.gunIndex + this.actionBuffer.switchGunOffset, this.guns.length);
            this.gun = this.guns[this.gunIndex];

            this.actionBuffer.switchGun = false;
        }
    }

    clientUpdate(data: ClientPlayerUpdate) {
        data.moveDirection = Vector.normalize(data.moveDirection); // Sanitize input

        this.actionBuffer = data;
    }

    toModel(): Entity<PlayerModel> {
        return {
            id: this.id,
            data: {
                nickname: this.nickname,
                health: this.health,
                maxHealth: this.maxHealth,
                speed: this.speed,
                transform: {
                    position: this.position,
                    rotation: this.rotation,
                    direction: this.direction
                },
                gun: this.gun.toModel()
            }
        };
    }
}