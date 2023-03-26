import GameObject from "../../core/browser/game/gameObject.js";
import { angleLerp } from "../../core/math/index.js";
import Vector from "../../core/math/vector.js";
import ZombieModel from "../../model/zombie";
import HealthBar from "../healthBar.js";
import ModelStateHandler from "../modelStateHandler.js";

export default class Zombie extends GameObject {
    public state: ModelStateHandler<ZombieModel>;

    private healthBar: HealthBar;

    constructor(data: ZombieModel) {
        super(data.transform.position, data.transform.rotation);

        this.state = new ModelStateHandler<ZombieModel>(data);

        this.healthBar = new HealthBar(this, 0.1, data.maxHealth, data.health);
    }

    public update(deltaTime: number) {
        this.healthBar.update(deltaTime);

        // Interpolation
        this.position = Vector.moveTowards(
            this.position, 
            this.state.current.transform.position, 
            this.state.current.speed * deltaTime
        )

        this.rotation = angleLerp(this.rotation, this.state.current.transform.rotation, 15 * deltaTime);
    }

    public updateState(newState: ZombieModel) {
        this.state.setState(newState);

        this.position = this.state.last.transform.position;
        this.direction = this.state.last.transform.direction;
        this.rotation = this.state.last.transform.rotation;

        this.healthBar.value = newState.health;
        this.healthBar.maxValue = newState.maxHealth;
    }

    render(context: CanvasRenderingContext2D): void {
        super.render(context);

        const size: number = 5;

        context.lineWidth = (size - 3);
        context.fillStyle = "red";
        context.strokeStyle = "red";

        context.beginPath();
        context.moveTo(0, size)
        context.lineTo((size * 2), size);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.moveTo(0, -size)
        context.lineTo((size * 2), -size);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.arc(0, 0, size, 0, (2 * Math.PI));
        context.fill();
        context.closePath();

        this.healthBar.render(context);
    }
}