/* 
    Handles input keys basic states
*/

export type KeyState = "preparePress" | "pressed" | "hold" | "prepareRelease" | "released"

export class ButtonStateHandler {
    private keys: { [index: string]: KeyState; } = {}; // Dictionary

    onKeyDown(key: string) {
        const _key: undefined | KeyState = this.keys[key];

        if(_key === undefined) {
            this.keys[key] = "preparePress"
        } 
    }

    onKeyUp(key: string) {
        this.keys[key] = "prepareRelease";
    }

    /** Invoke it before all frame actions */
    prepareForFrame() {
        const entries: [string, KeyState][] = Object.entries(this.keys);

        entries.forEach((item) => {
            const index = item[0];

            switch(item[1]) {
                case "preparePress": 
                    this.keys[index] = "pressed"; // Prepare for press action
                break;

                case "pressed": 
                    this.keys[index] = "hold"; // Move from state 'pressed' to 'hold'
                break;

                case "prepareRelease":
                    this.keys[index] = "released"; // Prepare for release action
                break;

                case "released": 
                    delete this.keys[index]; // Clear released key 
                break;
            }
        });
    }

    // Getters
    getKeyDown(key: string): boolean {
        return this.keys[key] === "pressed";
    }

    getKeyHold(key: string): boolean {
        return this.keys[key] === "hold" || this.getKeyDown(key);
    }

    getKeyUp(key: string): boolean {
        return this.keys[key] === "released";
    }
    // --Getters
}
