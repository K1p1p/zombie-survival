import Vector, { VectorZero } from "../../math/vector";
import { ButtonStateHandler } from "./buttonStateHandler";

export default class Mouse {
    private static buttonHandler: ButtonStateHandler = new ButtonStateHandler();

    private static lastState: undefined | MouseEvent = undefined;
    private static lastWheelState: undefined | WheelEvent = undefined;

    public static init(document: Document) {
        document.onmouseup   = (event: MouseEvent) => Mouse.buttonHandler.onKeyUp(event.button.toString());
        document.onmousedown = (event: MouseEvent) => Mouse.buttonHandler.onKeyDown(event.button.toString());

        function updateState(event: MouseEvent) { Mouse.lastState = event; }
        document.onmouseenter = updateState;
        document.onmousemove = updateState;

        document.onwheel = (event: WheelEvent) => { Mouse.lastWheelState = event; }
    }

    public static prepareForFrame() {
        Mouse.buttonHandler.prepareForFrame();
    }

    public static endOfFrame() {
        Mouse.lastWheelState = undefined;
    }

    public static getButtonDown(button: number): boolean {
        return Mouse.buttonHandler.getKeyDown(button.toString());
    }

    public static getButtonHold(button: number): boolean {
        return Mouse.buttonHandler.getKeyHold(button.toString());
    }

    public static getButtonUp(button: number): boolean {
        return Mouse.buttonHandler.getKeyUp(button.toString());
    }

    public static getMouseWheelDelta(): number {
        if(!Mouse.lastWheelState) { return 0; }

        return (Mouse.lastWheelState.deltaY > 0) ? 1 : -1;
    }

    public static getScreenPosition(): Vector {
        if(!Mouse.lastState) { return VectorZero(); }

        return {
            x: this.lastState!.pageX,
            y: this.lastState!.pageY,
        }
    }
}