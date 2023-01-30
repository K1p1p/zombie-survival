import { Mouse } from "../core/input/mouse.js";
import { Keyboard } from "../core/input/keyboard.js";
import Loop, { LoopAction } from "../../core/loop.js";

export default class GameLoop {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private logicLoop: Loop;
    private renderingLoop: Loop;

    private update: LoopAction;
    private draw: LoopAction;

    constructor(canvas: HTMLCanvasElement, update: LoopAction, draw: LoopAction) {
        // Canvas data
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        // Loops
        this.logicLoop     = new Loop(60, this.logic.bind(this));
        this.renderingLoop = new Loop(60, this.render.bind(this));

        // Loops actions
        this.update = update;
        this.draw = draw;

        // Canvas fill whole window
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;

        // Init input handling
        Mouse.init(document);
        Keyboard.init(document);
    }

    private logic(deltaTime: number) {
        // Prepare input states
        Mouse.prepareForFrame();
        Keyboard.prepareForFrame();
    
        this.update(deltaTime);
    }

    private render(deltaTime: number) {
        // Clear whole screen
        this.context.setTransform(1, 0, 0, 1, 0, 0); // Identity matrix
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        this.draw(deltaTime);
    }

    public destroy() {
        this.logicLoop.destroy();
        this.renderingLoop.destroy();
    }
}