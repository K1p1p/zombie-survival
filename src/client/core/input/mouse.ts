import Vector from "../../../core/vector.js";
import { ButtonStateHandler } from "./buttonStateHandler.js";

export class Mouse {
    private static buttonHandler: ButtonStateHandler = new ButtonStateHandler();

    private static lastState: undefined | MouseEvent = undefined;

    public static init(document: Document) {
        document.onmouseup   = (event: MouseEvent) => Mouse.buttonHandler.onKeyUp(event.button.toString());
        document.onmousedown = (event: MouseEvent) => Mouse.buttonHandler.onKeyDown(event.button.toString());

        function updateState(event: MouseEvent) { Mouse.lastState = event; }
        document.onmouseenter = updateState;
        document.onmousemove = updateState;
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

    public static getScreenPosition(): undefined | Vector {
        if(Mouse.lastState === undefined) { return undefined; }

        return {
            x: this.lastState.screenX,
            y: this.lastState.screenY,
        }
    }
}