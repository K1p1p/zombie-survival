export type LoopAction = (deltaTime: number) => void;

export default class Loop {
    private static ONE_SECOND: number = 1000;

    private FPS: number = 0;
    private lastTimestamp?: number;

    private timer: NodeJS.Timer;
    private action: (LoopAction | undefined);

    public constructor(fps: number, action?: LoopAction) {
        this.FPS = fps;
        this.timer = setInterval(this.loop.bind(this), (Loop.ONE_SECOND / this.FPS));

        this.action = action;
    }

    public destroy() {
        clearInterval(this.timer);
    }

    private loop() {
        var now = Date.now();

        if(!this.lastTimestamp) {
            this.lastTimestamp = now;
        }

        const deltaTime: number = ((now - this.lastTimestamp) / Loop.ONE_SECOND);
        this.lastTimestamp = now;

        this.action?.(deltaTime);
    } 
}