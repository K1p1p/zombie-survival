import Camera from "../../core/browser/game/camera";
import GameObject from "../../core/browser/game/gameObject";
import { angleLerp } from "../../core/math/index";
import Vector from "../../core/math/vector";
import PlayerModel from "../../model/player";
import HealthBar from "../healthBar";
import ModelStateHandler from "../modelStateHandler";
import Gun from "./gun";

export default class Player extends GameObject {
    public state: ModelStateHandler<PlayerModel>;

    public gun: Gun;

    private colliderRadius: number = 0.1;

    private healthBar: HealthBar;

    constructor(data: PlayerModel) {
        super(
            data.transform.position, 
            data.transform.rotation, 
            data.transform.direction
        );

        this.state = new ModelStateHandler<PlayerModel>(data);
        this.gun = new Gun(data.gun);

        this.healthBar = new HealthBar(this, this.colliderRadius, data.maxHealth, data.health);
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

        // Draw nickname
        context.beginPath();
        const namePos: Vector = Camera.projectWorldToPixels({
            x: this.position.x,
            y: this.position.y - this.colliderRadius
        });
        context.fillStyle = "black";
        context.resetTransform();
        context.translate(namePos.x, namePos.y);
        context.fillText(this.state.current.nickname, 0, 0);
        context.closePath();
    }
}