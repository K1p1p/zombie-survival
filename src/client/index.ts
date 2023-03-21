import Camera from "../core/browser/game/camera.js";
import GameLoop from "../core/browser/game/gameLoop.js";
import Keyboard, { KeyboardKey } from "../core/browser/input/keyboard.js";
import Mouse from "../core/browser/input/mouse.js";
import Vector, { VectorZero } from "../core/math/vector.js";

import CoordinateText from "./game/coordinateText.js";

import Player from "./game/player.js";
import Bullet from "./game/bullet.js";
import Zombie from "./game/zombie.js";

import MockServer, { ServerData } from "../server/index.js";

import GunUI from "./ui/gunUI.js";
import FpsUI from "./ui/fpsUI.js";

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const context: CanvasRenderingContext2D = canvas.getContext("2d");

const game: GameLoop = new GameLoop(canvas, update, draw);

const zombies: { [index: string]: Zombie; } = {};

const player: Player = new Player({
    gun: {
        ammo: 0,
        ammoCapacity: 0,
        isReloading: false
    },
    transform: {
        direction: VectorZero(),
        position: VectorZero(),
        rotation: 0
    }
});

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
    if(!player.gun) { return; }

    if(Keyboard.getKeyHold(KeyboardKey.R)) { mockServer.playerReload(); }

    if(Mouse.getButtonDown(0)) {
        if(player.gun.getAmmo() === 0) {
            mockServer.playerReload();
        } else {
            mockServer.playerShoot();
        }
    }
}

function draw(deltaTime: number) {
    if(!serverData) { return; }
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

    // Iterate over zombies dictionary
    for (let key in zombies) {
        zombies[key].render(context);
    }

    player.render(context);

    gunUI.render(context, player.gun.state.current);
    FPS.render(context, deltaTime);
}

// Server --------------------
const mockServer: MockServer = new MockServer(onServerUpdate);
let serverData: ServerData;
function onServerUpdate(data: string) {
    serverData = (JSON.parse(data) as ServerData);

    player.updateState(serverData.player);

    // Create/Update zombies
    serverData.zombies.forEach((zombieData) => {
        const zombie = zombies[zombieData.id];

        if(zombie) {
            zombie.updateState(zombieData)
        } else {
            zombies[zombieData.id] = new Zombie(zombieData);
        }
    });

    // [Workaround] Clear zombies destroyed in server (The ones which there's no data to update)
    for (let key in zombies) {
        const zombie = serverData.zombies.find((item) => (item.id === key));

        if(!zombie) {
            delete zombies[key];
        }  
    }
}