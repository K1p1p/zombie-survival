import Coordinates from "../core/browser/game/coordinates.js";
import GameObject from "../core/browser/game/gameObject.js";
import { lerp } from "../core/math/index.js";
import Transform from "../core/transform.js";

export default class HealthBar extends GameObject {
    private minWidth: number = 50;

    private width: number = this.minWidth;
    private height: number = 5;

    private xOffset: number;
    private yOffset: number

    public maxValue: number;

    private _value: number;
    public get value(): number { return Math.min(this._value, this.maxValue); }
    public set value(value: number) { this._value = Math.max(value, 0); }

    private smoothValue: number;

    private targetRadius: number
    private targetTransform: Transform

    constructor(targetTransform: Transform, targetRadius: number,  maxValue: number, value: number = maxValue) {
        super();
        this.targetRadius = targetRadius;
        this.targetTransform = targetTransform;

        this.maxValue = maxValue;
        this.value = Math.min(value, maxValue);
        this.smoothValue = this.value;
    }

    update(deltaTime: number) {
        this.smoothValue = lerp(this.smoothValue, this.value, deltaTime);

        const targetDiameter: number = (this.targetRadius * 2);
        this.width =  Math.max(this.minWidth, Coordinates.worldToPixelsScale(targetDiameter));

        this.xOffset = Coordinates.pixelsToWorldScale(-(this.width / 2));
        this.yOffset = (this.targetRadius + Coordinates.pixelsToWorldScale(15));

        this.position.x = this.targetTransform.position.x + this.xOffset;
        this.position.y = this.targetTransform.position.y + this.yOffset;
    }

    render(context: CanvasRenderingContext2D): void {
        super.render(context);

        this.drawLine(context, "black"  , 1.00);
        this.drawLine(context, "red"    , (this.smoothValue / this.maxValue));
        this.drawLine(context, "#39ff03", (this.value / this.maxValue));
    }

    private drawLine(context: CanvasRenderingContext2D, color: string, ratio: number) {
        context.beginPath();
        context.fillStyle = color;
        context.fillRect(0, 0, (this.width * ratio), this.height);
        context.closePath();
    }
}