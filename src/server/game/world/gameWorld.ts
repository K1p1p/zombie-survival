import Circle from "../../../core/geometry/circle";
import { Dictionary } from "../../../core/helpers/dictionary";
import { clamp } from "../../../core/math/index";
import Vector from "../../../core/math/vector";
import Entity from "../../../dto/entity";
import { ServerWorld } from "../../../dto/serverUpdate";
import BulletModel from "../../../model/bullet";
import { GUN_ID } from "../../../model/gun";
import { LootModel } from "../../../model/loot";
import PlayerModel from "../../../model/player";
import ZombieModel from "../../../model/zombie";
import INetworkObject from "../../networkObject";
import Bullet from "../bullet";
import GameObject from "../gameObject";
import Gun from "../gun/gun";
import { GunLoot } from "../loot/gunLoot";
import Loot from "../loot/loot";
import { MedKit } from "../loot/medKit";
import Player from "../player/player";
import Zombie from "../zombies/zombie";
import { BlueZombie, GreenZombie, RedZombie } from "../zombies/zombieVariants";
import ThreatManager from "./threatManager";

export default class GameWorld implements INetworkObject {
    public MAP_SIZE: number = 20;

    public MAP_LEFT  : number = -(this.MAP_SIZE / 2);
    public MAP_BOTTOM: number = -(this.MAP_SIZE / 2);
    public MAP_TOP   : number =  (this.MAP_SIZE / 2);
    public MAP_RIGHT : number =  (this.MAP_SIZE / 2);

    public players: Dictionary<Player> = {};
    public zombies: Dictionary<Zombie> = {};
    public loot: Dictionary<Loot> = {};
    public bullets: Bullet[] = [];

    private threatManager: ThreatManager;

    constructor() {
        this.threatManager = new ThreatManager(this);

        const canCreateZombie = () => this.threatManager.shouldCreateNewZombies();
        const createZombie = (zombie: Zombie) => {
            this.zombies[zombie.entityId] = zombie;
        }
        const getRandomPosition = () => {
            const pos: Vector = {
                x: (Math.random() * this.MAP_SIZE) - (this.MAP_SIZE / 2),
                y: (Math.random() * this.MAP_SIZE) - (this.MAP_SIZE / 2),
            };

            return pos;
        }

        setInterval(() => {
            if(!canCreateZombie()) { return; }

            if(Math.random() <= 0.40) { createZombie(new RedZombie  (getRandomPosition())); }
        }, 500);

        setInterval(() => {
            if(!canCreateZombie()) { return; }

            if(Math.random() <= 0.15) { createZombie(new BlueZombie (getRandomPosition())); }
        }, 1000);

        setInterval(() => {
            if(!canCreateZombie()) { return; }

            if(Math.random() <= 0.05) { createZombie(new GreenZombie(getRandomPosition())); }
        }, 2500);


        for (let index = 0; index < 10; index++) {
            const newLoot: Loot = new MedKit();
            newLoot.transform.position = getRandomPosition();
            this.loot[newLoot.entityId] = newLoot;

            const newLoot2: Loot = new GunLoot(GUN_ID.GENERIC_ASSAULT_RIFLE, "Assault Rifle", 30);
            newLoot2.transform.position = getRandomPosition();
            this.loot[newLoot2.entityId] = newLoot2;
        }
    }

    public update(deltaTime: number) {
        this.threatManager.update();

        // Clear bullets array
        this.bullets.length = 0;

        // Update players
        Object.values(this.players).forEach((player) => {
            player.update(deltaTime, this)

            // Clamp position to map bounds
            player.transform.position.x = clamp(player.transform.position.x, this.MAP_LEFT  , this.MAP_RIGHT);
            player.transform.position.y = clamp(player.transform.position.y, this.MAP_BOTTOM, this.MAP_TOP  );
        });

        // Update zombies
        Object.values(this.zombies).forEach((zombie) => zombie.update(deltaTime, Object.values(this.players)));

        // Update loot
        Object.values(this.loot).forEach((loot) => {
            const players: Player[] = Object.values(this.players);
            for (let index = 0; index < players.length; index++) {
                const player: Player = players[index];
                
                if(Circle.intersectsSphere(player.collider.collider, loot.collider.collider)) {
                    if(loot.use(player)) {
                        delete this.loot[loot.entityId];
                        break;
                    }
                }
            }
        });
    }

    public createBullet(creator: GameObject, newBullet: (Bullet | null), gun: (Gun | null)) {
        if (!gun) { return; }
        if (!newBullet) { return; }

        const ENABLE_FRIENDLY_FIRE: boolean = true;
        const hitable: GameObject[] = ENABLE_FRIENDLY_FIRE
            ? [...Object.values(this.zombies), ...Object.values(this.players)]
            : Object.values(this.zombies)

        const hit = newBullet.collisionCheck(creator, hitable);

        if (hit) {
            // Damage gameobject
            hit.health -= gun.attackPower;

            if (hit.health <= 0) {
                // Destroy if zombie
                delete this.zombies[hit.entityId];
            }
        }

        this.bullets.push(newBullet);
    }

    public toModel(): ServerWorld {
        return {
            map: {
                width: this.MAP_SIZE,
                height: this.MAP_SIZE,
            },

            players: Object.values(this.players).map<Entity<PlayerModel>>((item) => item.toModel()),
            zombies: Object.values(this.zombies).map<Entity<ZombieModel>>((item) => item.toModel()),
            
            loot: Object.values(this.loot).map<Entity<LootModel>>((item) => item.toModel()),

            bullets: this.bullets.map<BulletModel>((item) => item.toModel()),
        };
    }
}