export default class FPSCounter {
    private fps: number = 0;
    private intervalStart: number = Date.now();
    private desiredInterval: number = 250;

    public update(deltaTime: number) {
        if((Date.now() - this.intervalStart) < this.desiredInterval) { return; }

        this.fps = Math.round(1 / deltaTime);
        this.intervalStart = Date.now();
    }

    public getFPS(): number {
        return this.fps;
    }
}