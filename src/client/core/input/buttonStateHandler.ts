/* 
    Handles input keys basic states
*/

export type KeyState = "pressed" | "hold" | "released"

export class ButtonStateHandler {
    private keys: Array<KeyState> = [];

    onKeyDown(key: string) {
        const _key: undefined | KeyState = this.keys[key];

        if(_key === undefined || _key === "released") {
            this.keys[key] = "pressed"
            return;
        } 

        if(_key === "pressed") {
            this.keys[key] = "hold";
        }
    }

    onKeyUp(key: string) {
        this.keys[key] = "released";
    }

    // Getters
    getKeyDown(key: string): boolean {
        return this.keys[key] == "pressed";
    }

    getKeyHold(key: string): boolean {
        return this.keys[key] == "hold" || this.getKeyDown(key);
    }

    getKeyUp(key: string): boolean {
        return this.keys[key] == "released";
    }
    // --Getters
}
