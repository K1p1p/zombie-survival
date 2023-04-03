import Vector, { VectorZero } from "../../core/math/vector";
import Gun from "./gun/gun";
import PlayerModel from "../../model/player";
import { ClientPlayerUpdate } from "../../dto/clientUpdate";
import Entity from "../../dto/entity";
import { loop } from "../../core/math/index";
import Pistol from "./gun/list/pistol";
import AssaultRifle from "./gun/list/assaultRifle";
import { GunTrigger, TRIGGER_STATE } from "./gun/gunTrigger";
import GameObject from "./gameObject";
import GameWorld from "./world/gameWorld";

export default class Player extends GameObject {
    public webSocketId?: string;

    public nickname: string;

    public id: string = ("player:" + Math.random() * Number.MAX_SAFE_INTEGER);
    public maxHealth: number = 100;
    public health: number = this.maxHealth;
    public get isAlive(): boolean { return this.health > 0 }

    public gun: Gun;
    private gunTrigger: GunTrigger = new GunTrigger();

    public guns: Gun[];
    public gunIndex: number = 0;

    protected speed: number = 1;

    private actionBuffer: ClientPlayerUpdate = {
        moveDirection: VectorZero(),
        rotation: 0,
        shoot: false,
        reload: false,
        switchGun: false,
        switchGunOffset: 0,
        switchGunFireMode: false
    }

    constructor(nickname: string) {
        super();

        this.nickname = nickname;
        this.guns = [
            new Pistol(this.transform),
            new AssaultRifle(this.transform),
        ];
        this.gun = this.guns[this.gunIndex];
    }

    reload() {
        this.gun.reload();
    }

    update(deltaTime: number, gameWorld: GameWorld) {
        if(!this.isAlive) { return; }

        const normalizedDir: Vector = Vector.normalize(this.actionBuffer.moveDirection);
        const step = (this.speed * deltaTime);
    
        this.transform.translate({
            x: (normalizedDir.x * step),
            y: (normalizedDir.y * step),
        })

        this.transform.rotation = this.actionBuffer.rotation;

        this.gunTrigger.update(this.actionBuffer.shoot);

        if(this.actionBuffer.reload) { this.reload(); }

             if(this.gunTrigger.state === TRIGGER_STATE.ON_PULL   ) { this.gun.triggerPull(); }
        else if(this.gunTrigger.state === TRIGGER_STATE.ON_RELEASE) { this.gun.triggerRelease(); }

        this.gun.update(gameWorld);

        if(this.actionBuffer.switchGunFireMode) {
            this.gun.switchFireMode();
            this.actionBuffer.switchGunFireMode = false;
        }

        if(this.actionBuffer.switchGun) { 
            this.gunIndex = loop(this.gunIndex + this.actionBuffer.switchGunOffset, this.guns.length);
            this.gun = this.guns[this.gunIndex];

            this.actionBuffer.switchGun = false;

            this.gunTrigger.reset();
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
                    position: this.transform.position,
                    rotation: this.transform.rotation,
                    direction: this.transform.direction
                },
                gun: this.gun.toModel()
            }
        };
    }
}