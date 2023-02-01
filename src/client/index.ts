import Camera from "./core/camera.js";
import { lerp } from "../core/math.js";
import { Mouse } from "./core/input/mouse.js";
import { Keyboard, KeyboardKey } from "./core/input/keyboard.js";
import Vector, { VectorZero } from "../core/vector.js";
import { normalize } from "../core/vectorMath.js";
import GameLoop from "./core/gameloop.js";
import GameObject from "./core/gameObject.js";

console.log("CLIENT WITH IMPORTED FILE: " + lerp(0, 100, 0.5));

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const context: CanvasRenderingContext2D = canvas.getContext("2d");

const camera: Camera = new Camera(canvas, 0, 2, 10);
const game: GameLoop = new GameLoop(canvas, update, draw);

class CoordinateText extends GameObject {
    render(context: CanvasRenderingContext2D, camera: Camera): void {
        super.render(context, camera);

        context.fillStyle = "black";
        context.fillText(`(${this.position.x.toFixed(1)}, ${this.position.y.toFixed(1)})`, 0, 0);
    }
}

class Character extends GameObject {
    update(deltaTime: number) {
        const mousePos = camera.projectScreenToWorld(Mouse.getScreenPosition());
        this.rotation = Math.atan2(-(mousePos.y - this.position.y), (mousePos.x - this.position.x));
    }

    render(context: CanvasRenderingContext2D, camera: Camera): void {
        super.render(context, camera);

        context.lineWidth = 2;
        context.fillStyle = "black";
        context.strokeStyle = "black";

        context.beginPath();
        context.moveTo(0, 0)
        context.lineTo(10, 0);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.arc(0, 0, 5, 0, (2 * Math.PI));
        context.fill();
        context.closePath();
    }
}

class Zombie extends GameObject {
    update(deltaTime: number, player: Character) {
        this.lookAt(player.position);

        const normalizedDir: Vector = normalize(this.direction);
        const speed = 0.5;
        const step = (speed * deltaTime);

        this.translate({
            x: (normalizedDir.x * step),
            y: (normalizedDir.y * step),
        })
    }

    render(context: CanvasRenderingContext2D, camera: Camera): void {
        super.render(context, camera);

        const size: number = 5;

        context.lineWidth = (size - 3);
        context.fillStyle = "red";
        context.strokeStyle = "red";

        context.beginPath();
        context.moveTo(0, size)
        context.lineTo(10, size);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.moveTo(0, -size)
        context.lineTo(10, -size);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.arc(0, 0, size, 0, (2 * Math.PI));
        context.fill();
        context.closePath();
    }
}

const player: Character = new Character(VectorZero());
const zombie: Zombie = new Zombie(VectorZero());

function update(deltaTime: number) {
    const moveDirection: Vector = VectorZero();
    if(Keyboard.getKeyHold(KeyboardKey.ArrowRight)) { moveDirection.x += 1; }
    if(Keyboard.getKeyHold(KeyboardKey.ArrowLeft )) { moveDirection.x -= 1; }
    if(Keyboard.getKeyHold(KeyboardKey.ArrowUp   )) { moveDirection.y += 1; }
    if(Keyboard.getKeyHold(KeyboardKey.ArrowDown )) { moveDirection.y -= 1; }

    const normalizedDir: Vector = normalize(moveDirection);
    const speed = 1;
    const step = (speed * deltaTime);

    player.translate({
        x: (normalizedDir.x * step),
        y: (normalizedDir.y * step),
    })

    camera.position = player.position;

    player.update(deltaTime);
    zombie.update(deltaTime, player);
}

function draw(deltaTime: number) {
    context.font = "12px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

    for (let x = -10; x <= 10; x++) {
        for (let y = -10; y <= 10; y++) {
            new CoordinateText({ x: x, y: y }).render(context, camera);
        }
    }

    // Mouse position displayer
    const mousePos = camera.projectScreenToWorld(Mouse.getScreenPosition());
    new CoordinateText(mousePos).render(context, camera);

    player.render(context, camera);
    zombie.render(context, camera);
}
