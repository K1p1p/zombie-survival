import { ButtonStateHandler } from "./buttonStateHandler.js";

export enum KeyboardKey {
    ArrowUp = "ArrowUp",
    ArrowLeft = "ArrowLeft",
    ArrowDown = "ArrowDown",
    ArrowRight = "ArrowRight",

    W = "w",
    A = "a",
    S = "s",
    D = "d",

    R = "r",
}

export default class Keyboard {
    private static buttonHandler: ButtonStateHandler = new ButtonStateHandler();

    public static init(document: Document) {
        document.onkeyup   = (event: KeyboardEvent) => Keyboard.buttonHandler.onKeyUp(event.key);
        document.onkeydown = (event: KeyboardEvent) => Keyboard.buttonHandler.onKeyDown(event.key);
    }

    public static prepareForFrame() {
        Keyboard.buttonHandler.prepareForFrame();
    }

    public static getKeyDown(key: KeyboardKey): boolean {
        return Keyboard.buttonHandler.getKeyDown(key);
    }

    public static getKeyHold(key: KeyboardKey): boolean {
        return Keyboard.buttonHandler.getKeyHold(key);
    }

    public static getKeyUp(key: KeyboardKey): boolean {
        return Keyboard.buttonHandler.getKeyUp(key);
    }
}