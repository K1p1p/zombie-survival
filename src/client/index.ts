import Loop from "../core/loop.js";
import Camera from "./core/camera.js";
import { lerp } from "../core/math.js";
import GameObject from "./core/gameObject.js";
import { Mouse } from "./core/input/mouse.js";
import { Keyboard, KeyboardKey } from "./core/input/keyboard.js";
import Vector, { VectorZero } from "../core/vector.js";
import { normalize } from "../core/vectorMath.js";
import World from "./core/world/world.js";

console.log("CLIENT WITH IMPORTED FILE: " + lerp(0, 100, 0.5));

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

const context: CanvasRenderingContext2D = canvas.getContext("2d");

const logicLoop: Loop = new Loop(60, logic);
const renderingLoop: Loop = new Loop(60, render);
const camera: Camera = new Camera(canvas, 0, 2, 10);

// Init input
Mouse.init(document);
Keyboard.init(document);

class CoordinateText extends GameObject {
    render(context: CanvasRenderingContext2D, camera: Camera): void {
        super.render(context, camera);

        context.fillText(`(${this.position.x}, ${this.position.y})`, 0, 0);
    }
}

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
}

function logic() {
    const moveDirection: Vector = VectorZero();
    if(Keyboard.getKeyHold(KeyboardKey.ArrowRight)) { moveDirection.x += 1; }
    if(Keyboard.getKeyHold(KeyboardKey.ArrowLeft )) { moveDirection.x -= 1; }
    if(Keyboard.getKeyHold(KeyboardKey.ArrowUp   )) { moveDirection.y -= 1; } // Canvas Y-axis is inverted
    if(Keyboard.getKeyHold(KeyboardKey.ArrowDown )) { moveDirection.y += 1; } // Canvas Y-axis is inverted

    const normalizedDir: Vector = normalize(moveDirection);
    const step = (World.screenToWorldScale(1) * renderingLoop.getDeltaTime());

    camera.position.x += (normalizedDir.x * step * logicLoop.getDeltaTime());
    camera.position.y += (normalizedDir.y * step * logicLoop.getDeltaTime());
}