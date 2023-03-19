import FPSCounter from "../../core/browser/helper/fpsCounter.js";

export default class FpsUI {
    private counter: FPSCounter = new FPSCounter();

    render(context: CanvasRenderingContext2D, deltaTime: number): void {
        this.counter.update(deltaTime);

        context.resetTransform();

        context.font = "15px Arial";
        context.textAlign = "right";
        context.textBaseline = "bottom";
        context.resetTransform();

        context.fillText(`FPS: ${this.counter.getFPS()}`, document.body.clientWidth, document.body.clientHeight);
    }
}