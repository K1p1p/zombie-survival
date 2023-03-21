import GameObject from "../../core/browser/game/gameObject.js";
import { angleLerp } from "../../core/math/index.js";
import Vector from "../../core/math/vector.js";
import PlayerModel from "../../dto/player.js";
import ModelStateHandler from "../modelStateHandler.js";
import Gun from "./gun.js";

export default class Player extends GameObject {
    public state: ModelStateHandler<PlayerModel>;

    public gun: Gun;

    constructor(data: PlayerModel) {
        super(
            data.transform.position, 
            data.transform.rotation, 
            data.transform.direction
        );

        this.state = new ModelStateHandler<PlayerModel>(data);
        this.gun = new Gun(data.gun);
    }

    public updateState(newState: PlayerModel) {
        this.state.setState(newState);
        this.gun.updateState(this.state.current.gun);

        this.position = newState.transform.position;
        this.direction = newState.transform.direction;
        this.rotation = newState.transform.rotation;
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
    }
}