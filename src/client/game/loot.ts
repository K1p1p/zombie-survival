import GameObject from "../../core/browser/game/gameObject";
import { LootModel } from "../../model/loot";

export default class Loot extends GameObject {
    public data: LootModel;

    constructor(data: LootModel) {
        super(data.transform.position, data.transform.rotation);

        this.data = data;
    }

    public updateState(newState: LootModel) {
        this.position = newState.transform.position;
        this.direction = newState.transform.direction;
        this.rotation = newState.transform.rotation;
    }

    render(context: CanvasRenderingContext2D): void {
        super.render(context);

        context.beginPath();
        context.fillStyle = 'red';
        context.fillRect(-15, -10, 30, 20);
        context.fillStyle = 'black';
        context.font = "15px Arial";
        context.fillText(this.data.name, 0, 0);
        context.fill();
        context.closePath();
    }
}