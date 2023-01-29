export default class Loop {
    private static ONE_SECOND: number = 1000;

    private FPS: number = 0;
    private deltaTime: number = 0;
    private lastTimestamp?: number;

    private timer: NodeJS.Timer;
    private action: (() => void) | undefined;

    public constructor(fps: number, action?: () => void) {
        this.FPS = fps;
        this.timer = setInterval(this.loop.bind(this), (Loop.ONE_SECOND / this.FPS));

        this.action = action;
    }

    public setLoopAction(action: () => void) {
        this.action = action;
    }

    public getDeltaTime() {
        return this.deltaTime;
    }

    public destroy() {
        clearInterval(this.timer);
    }

    private loop() {
        var now = Date.now();

        if(!this.lastTimestamp) {
            this.lastTimestamp = now;
        }

        this.deltaTime = ((now - this.lastTimestamp) / Loop.ONE_SECOND);
        this.lastTimestamp = now;

        this.action?.();
    } 
}