import { ButtonStateHandler } from "./buttonStateHandler";

export default class Keyboard {
    private static buttonHandler: ButtonStateHandler = new ButtonStateHandler();

    public static init(document: Document) {
        document.onkeyup   = (event: KeyboardEvent) => Keyboard.buttonHandler.onKeyUp(event.key);
        document.onkeydown = (event: KeyboardEvent) => Keyboard.buttonHandler.onKeyDown(event.key);
    }

    public static prepareForFrame() {
        Keyboard.buttonHandler.prepareForFrame();
    }

    public static getKeyDown(key: string): boolean {
        return Keyboard.buttonHandler.getKeyDown(key);
    }

    public static getKeyHold(key: string): boolean {
        return Keyboard.buttonHandler.getKeyHold(key);
    }

    public static getKeyUp(key: string): boolean {
        return Keyboard.buttonHandler.getKeyUp(key);
    }
}