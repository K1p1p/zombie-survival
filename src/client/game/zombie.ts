import GameObject from "../../core/browser/game/gameObject.js";
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
    }

    public updateState(newState: ZombieModel) {
        this.state.setState(newState);

        this.position = newState.transform.position;
        this.direction = newState.transform.direction;
        this.rotation = newState.transform.rotation;

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