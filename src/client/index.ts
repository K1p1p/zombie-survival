import Loop from "../core/loop.js";
import Camera from "./core/camera.js";
import { lerp } from "../core/math.js";
import GameObject from "./core/gameObject.js";

console.log("CLIENT WITH IMPORTED FILE: " + lerp(0, 100, 0.5));

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

const context: CanvasRenderingContext2D = canvas.getContext("2d");

const renderingLoop: Loop = new Loop(60, render);
const camera: Camera = new Camera(canvas, 0, 2, 10);

class CoordinateText extends GameObject {
    render(context: CanvasRenderingContext2D, camera: Camera): void {
        super.render(context, camera);

        context.fillText(`(${this.position.x}, ${this.position.y})`, 0, 0);
    }
}

let cameraOffset: number = 0;
function render() {
    context.setTransform(1, 0, 0, 1, 0, 0); // Identity matrix
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.font = "12px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

    for (let x = -10; x <= 10; x++) {
        for (let y = -10; y <= 10; y++) {
            new CoordinateText({ x: x, y: y }).render(context, camera);
        }
    }

    camera.position.x = Math.sin(cameraOffset += (1 * renderingLoop.getDeltaTime()));
    camera.position.y = Math.sin(cameraOffset += (1 * renderingLoop.getDeltaTime()));
}