export type KeyState = "preparePress" | "pressed" | "hold" | "prepareRelease" | "released"

/** Handles input keys basic states. Checks all keys as lowercase. */
export class ButtonStateHandler {
    private keys: { [index: string]: KeyState; } = {}; // Dictionary

    /** Prevent uppercase and shift+key. Which kept button stuck */
    private sanitizeKey(key: string): string {
        return key.toLowerCase();
    }

    onKeyDown(key: string) {
        key = this.sanitizeKey(key); 

        const _key: undefined | KeyState = this.keys[key];

        if(_key === undefined) {
            this.keys[key] = "preparePress"
        } 
    }

    onKeyUp(key: string) {
        key = this.sanitizeKey(key); 

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
        key = this.sanitizeKey(key); 

        return this.keys[key] === "pressed";
    }

    getKeyHold(key: string): boolean {
        key = this.sanitizeKey(key); 

        return this.keys[key] === "hold" || this.getKeyDown(key);
    }

    getKeyUp(key: string): boolean {
        key = this.sanitizeKey(key); 

        return this.keys[key] === "released";
    }
    // --Getters
}
