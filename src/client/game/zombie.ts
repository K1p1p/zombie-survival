import GameObject from "../../core/browser/game/gameObject.js";
import ZombieModel from "../../model/zombie";
import ModelStateHandler from "../modelStateHandler.js";

export default class Zombie extends GameObject {
    public state: ModelStateHandler<ZombieModel>;

    constructor(data: ZombieModel) {
        super(data.transform.position, data.transform.rotation);

        this.state = new ModelStateHandler<ZombieModel>(data);
    }

    public updateState(newState: ZombieModel) {
        this.state.setState(newState);

        this.position = newState.transform.position;
        this.direction = newState.transform.direction;
        this.rotation = newState.transform.rotation;
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
    }
}