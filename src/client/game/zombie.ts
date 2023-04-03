import Coordinates from "../../core/browser/game/coordinates";
import GameObject from "../../core/browser/game/gameObject";
import { angleLerp } from "../../core/math/index";
import Vector from "../../core/math/vector";
import ZombieModel from "../../model/zombie";
import HealthBar from "../healthBar";
import ModelStateHandler from "../modelStateHandler";

export default class Zombie extends GameObject {
    public state: ModelStateHandler<ZombieModel>;

    private healthBar: HealthBar;

    constructor(data: ZombieModel) {
        super(data.transform.position, data.transform.rotation);

        this.state = new ModelStateHandler<ZombieModel>(data);

        this.healthBar = new HealthBar(this, this.state.current.size, data.maxHealth, data.health);
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

        const size: number = Coordinates.worldToPixelsScale(this.state.current.size);

        context.lineWidth = (size * 0.75);
        context.fillStyle = this.state.current.color;
        context.strokeStyle = this.state.current.color;

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