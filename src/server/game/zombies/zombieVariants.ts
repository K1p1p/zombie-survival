import Vector from "../../../core/math/vector";
import Zombie from "./zombie";

export class RedZombie extends Zombie {
    constructor(position: Vector) {
        super(position);

        this.threatValue = 1;

        this.maxHealth = 10;
        this.attackPower = 5;
        this.color = "red";
        this.size = 0.05;
        this.speed = 0.85;

        this.loadBaseStats();
    }
}

export class BlueZombie extends Zombie {
    constructor(position: Vector) {
        super(position);

        this.threatValue = 2;

        this.maxHealth = 25;
        this.attackPower = 15;
        this.color = "blue";
        this.size = 0.075;
        this.speed = 1.1;

        this.loadBaseStats();
    }
}

export class GreenZombie extends Zombie {
    constructor(position: Vector) {
        super(position);

        this.threatValue = 8;

        this.maxHealth = 125;
        this.attackPower = 50;
        this.color = "green";
        this.size = 0.3;
        this.speed = 1.4;

        this.loadBaseStats();
    }
}