import { Dictionary } from "../../../core/helpers/dictionary";
import Vector from "../../../core/math/vector";
import Entity from "../../../dto/entity";
import { ServerWorld } from "../../../dto/serverUpdate";
import BulletModel from "../../../model/bullet";
import PlayerModel from "../../../model/player";
import ZombieModel from "../../../model/zombie";
import INetworkObject from "../../networkObject";
import Bullet from "../bullet";
import Gun from "../gun/gun";
import Player from "../player";
import Zombie from "../zombies/zombie";
import { BlueZombie, GreenZombie, RedZombie } from "../zombies/zombieVariants";

export default class GameWorld implements INetworkObject {
    public MAP_SIZE: number = 20;

    public players: Dictionary<Player> = {};
    public zombies: Dictionary<Zombie> = {};
    public bullets: Bullet[] = [];

    constructor() {
        const canCreateZombie = () => (Object.values(this.zombies).length <= 50)
        const createZombie = (zombie: Zombie) => {
            this.zombies[zombie.id] = zombie;
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

            if(Math.random() <= 0.50) { createZombie(new RedZombie  (getRandomPosition())); }
        }, 2000);

        setInterval(() => {
            if(!canCreateZombie()) { return; }

            if(Math.random() <= 0.25) { createZombie(new BlueZombie (getRandomPosition())); }
        }, 2000);

        setInterval(() => {
            if(!canCreateZombie()) { return; }

            if(Math.random() <= 0.10) { createZombie(new GreenZombie(getRandomPosition())); }
        }, 2000);
    }

    public update(deltaTime: number) {
        // Clear bullets array
        this.bullets.length = 0;

        // Update players
        Object.values(this.players).forEach((player) => player.update(deltaTime, this));

        // Update zombies
        Object.values(this.zombies).forEach((zombie) => zombie.update(deltaTime, Object.values(this.players)));
    }

    public createBullet(newBullet: (Bullet | null), gun: (Gun | null)) {
        if (!gun) { return; }
        if (!newBullet) { return; }

        const hit = newBullet.collisionCheck(Object.values(this.zombies));

        if (hit) {
            // Damage zombie
            hit.health -= gun.attackPower;

            if (hit.health <= 0) {
                // Destroy zombie
                delete this.zombies[hit.id];
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

            bullets: this.bullets.map<BulletModel>((item) => item.toModel()),
        };
    }
}