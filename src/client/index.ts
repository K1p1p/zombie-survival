import Camera from "../core/browser/game/camera.js";
import GameLoop from "../core/browser/game/gameLoop.js";
import Keyboard, { KeyboardKey } from "../core/browser/input/keyboard.js";
import Mouse from "../core/browser/input/mouse.js";
import Vector, { VectorZero } from "../core/math/vector.js";

import CoordinateText from "./game/coordinateText.js";

import Gun    from "./game/gun.js";
import Player from "./game/player.js";
import Bullet from "./game/bullet.js";
import Zombie from "./game/zombie.js";

import MockServer, { ServerData } from "../server/index.js";

import GunUI from "./ui/gunUI.js";
import FpsUI from "./ui/fpsUI.js";

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const context: CanvasRenderingContext2D = canvas.getContext("2d");

const game: GameLoop = new GameLoop(canvas, update, draw);

let player: (Player | null) = null;
let gun: (Gun | null) = null;

const FPS: FpsUI = new FpsUI();
const gunUI: GunUI = new GunUI();

function update(deltaTime: number) {
    // Player update -----------
    if(!player) { return; }

    const mousePos = Camera.projectScreenToWorld(Mouse.getScreenPosition());

    const moveDirection: Vector = VectorZero();
    if(Keyboard.getKeyHold(KeyboardKey.ArrowRight) || Keyboard.getKeyHold(KeyboardKey.D)) { moveDirection.x += 1; }
    if(Keyboard.getKeyHold(KeyboardKey.ArrowLeft ) || Keyboard.getKeyHold(KeyboardKey.A)) { moveDirection.x -= 1; }
    if(Keyboard.getKeyHold(KeyboardKey.ArrowUp   ) || Keyboard.getKeyHold(KeyboardKey.W)) { moveDirection.y += 1; }
    if(Keyboard.getKeyHold(KeyboardKey.ArrowDown ) || Keyboard.getKeyHold(KeyboardKey.S)) { moveDirection.y -= 1; }

    const playerRotation: number = Math.atan2(
        -(mousePos.y - player.position.y), 
         (mousePos.x - player.position.x)
    );

    mockServer.playerMove(moveDirection);
    mockServer.playerSetRotation(playerRotation);

    Camera.position = player.position;

    // Gun update -----------
    if(!gun) { return; }

    if(Keyboard.getKeyHold(KeyboardKey.R)) { mockServer.playerReload(); }

    if(Mouse.getButtonDown(0)) {
        if(gun.state.ammo === 0) {
            mockServer.playerReload();
        } else {
            mockServer.playerShoot();
        }
    }
}

function draw(deltaTime: number) {
    if(!player) { return; }

    for (let x = -(serverData.mapWidth / 2); x <= (serverData.mapWidth / 2); x++) {
        for (let y = -(serverData.mapHeight / 2); y <= (serverData.mapHeight / 2); y++) {
            new CoordinateText({ x: x, y: y }).render(context);
        }
    }

    // Mouse position displayer
    const mousePos = Camera.projectScreenToWorld(Mouse.getScreenPosition());
    new CoordinateText(mousePos).render(context);

    serverData.bullets.forEach(item => new Bullet(item).render(context));
    serverData.zombies.forEach(item => new Zombie(item).render(context));

    player.render(context);

    gunUI.render(context, gun.state);
    FPS.render(context, deltaTime);
}

// Server --------------------
const mockServer: MockServer = new MockServer(onServerUpdate);
let serverData: ServerData;
function onServerUpdate(data: ServerData) {
    serverData = data;
    
    player = new Player(serverData.player);

    // TODO: Make a better logic for it
    if(gun) {
        gun.update(serverData.player.gun);
    } else {
        gun = new Gun(serverData.player.gun);
    }
}