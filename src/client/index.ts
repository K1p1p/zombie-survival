import Mouse from "./core/input/mouse.js";
import Keyboard, { KeyboardKey } from "./core/input/keyboard.js";
import Vector, { VectorZero } from "../core/vector.js";
import { normalize } from "../core/vectorMath.js";
import Camera from "./core/game/camera.js";
import GameLoop from "./core/game/gameLoop.js";
import Character from "./game/character.js";
import CoordinateText from "./game/coordinateText.js";
import Zombie from "./game/zombie.js";

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const context: CanvasRenderingContext2D = canvas.getContext("2d");

const game: GameLoop = new GameLoop(canvas, update, draw);

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

    Camera.position = player.position;

    player.update(deltaTime);
    zombie.update(deltaTime, player);
}

function draw(deltaTime: number) {
    context.font = "12px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

    for (let x = -10; x <= 10; x++) {
        for (let y = -10; y <= 10; y++) {
            new CoordinateText({ x: x, y: y }).render(context);
        }
    }

    // Mouse position displayer
    const mousePos = Camera.projectScreenToWorld(Mouse.getScreenPosition());
    new CoordinateText(mousePos).render(context);

    player.render(context);
    zombie.render(context);
}
