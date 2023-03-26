import GameObject from "../../core/browser/game/gameObject.js";
import { angleLerp } from "../../core/math/index.js";
import Vector from "../../core/math/vector.js";
import PlayerModel from "../../model/player";
import HealthBar from "../healthBar.js";
import ModelStateHandler from "../modelStateHandler.js";
import Gun from "./gun.js";

export default class Player extends GameObject {
    public state: ModelStateHandler<PlayerModel>;

    public gun: Gun;

    private healthBar: HealthBar;

    constructor(data: PlayerModel) {
        super(
            data.transform.position, 
            data.transform.rotation, 
            data.transform.direction
        );

        this.state = new ModelStateHandler<PlayerModel>(data);
        this.gun = new Gun(data.gun);

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

    public updateState(newState: PlayerModel) {
        this.state.setState(newState);
        this.gun.updateState(this.state.current.gun);

        this.position = this.state.last.transform.position;
        this.direction = this.state.last.transform.direction;
        this.rotation = this.state.last.transform.rotation;

        this.healthBar.value = newState.health;
        this.healthBar.maxValue = newState.maxHealth;
    }

    render(context: CanvasRenderingContext2D): void {
        super.render(context);

        context.lineWidth = 2;
        context.fillStyle = "black";
        context.strokeStyle = "black";

        context.beginPath();
        context.moveTo(0, 0)
        context.lineTo(10, 0);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.arc(0, 0, 5, 0, (2 * Math.PI));
        context.fill();
        context.closePath();

        this.healthBar.render(context);
    }
}