import Camera from "../core/browser/game/camera.js";
import GameLoop from "../core/browser/game/gameLoop.js";
import Keyboard, { KeyboardKey } from "../core/browser/input/keyboard.js";
import Mouse from "../core/browser/input/mouse.js";
import Vector, { VectorZero } from "../core/math/vector.js";
import { Bullet } from "./game/bullet.js";
import Character from "./game/character.js";
import CoordinateText from "./game/coordinateText.js";
import Zombie from "./game/zombie.js";

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const context: CanvasRenderingContext2D = canvas.getContext("2d");

const game: GameLoop = new GameLoop(canvas, update, draw);

const mapWidth: number = 20;
const mapHeight: number = 20;

const player: Character = new Character(VectorZero());
const bullets: Bullet[] = [];
const zombies: Zombie[] = [];
setInterval(() => {
    const pos: Vector = {
        x: ((Math.random() * mapWidth) - (mapWidth / 2)),
        y: ((Math.random() * mapHeight) - (mapHeight / 2)),
    }
    
    zombies.push(new Zombie(pos));
}, 1000);

function update(deltaTime: number) {
    // Clear bullets array
    bullets.length = 0;

    if(Mouse.getButtonDown(0)) {
        const mousePos = Camera.projectScreenToWorld(Mouse.getScreenPosition());

        const bulletDir: Vector = Vector.normalize({
            x: (mousePos.x - player.position.x),
            y: (mousePos.y - player.position.y),
        });

        bullets.push(new Bullet(player.position, bulletDir, 8, zombies))
    }

    const moveDirection: Vector = VectorZero();
    if(Keyboard.getKeyHold(KeyboardKey.ArrowRight) || Keyboard.getKeyHold(KeyboardKey.D)) { moveDirection.x += 1; }
    if(Keyboard.getKeyHold(KeyboardKey.ArrowLeft ) || Keyboard.getKeyHold(KeyboardKey.A)) { moveDirection.x -= 1; }
    if(Keyboard.getKeyHold(KeyboardKey.ArrowUp   ) || Keyboard.getKeyHold(KeyboardKey.W)) { moveDirection.y += 1; }
    if(Keyboard.getKeyHold(KeyboardKey.ArrowDown ) || Keyboard.getKeyHold(KeyboardKey.S)) { moveDirection.y -= 1; }

    const normalizedDir: Vector = Vector.normalize(moveDirection);
    const speed = 1;
    const step = (speed * deltaTime);

    player.translate({
        x: (normalizedDir.x * step),
        y: (normalizedDir.y * step),
    })

    Camera.position = player.position;

    player.update(deltaTime);
    zombies.forEach(zombie => zombie.update(deltaTime, player));
}

function draw(deltaTime: number) {
    context.font = "12px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

    for (let x = -(mapWidth / 2); x <= (mapWidth / 2); x++) {
        for (let y = -(mapHeight / 2); y <= (mapHeight / 2); y++) {
            new CoordinateText({ x: x, y: y }).render(context);
        }
    }

    // Mouse position displayer
    const mousePos = Camera.projectScreenToWorld(Mouse.getScreenPosition());
    new CoordinateText(mousePos).render(context);

    bullets.forEach(bullet => bullet.render(context));
    zombies.forEach(zombie => zombie.render(context));

    player.render(context);
}