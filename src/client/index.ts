import Camera from "../core/browser/game/camera.js";
import GameLoop from "../core/browser/game/gameLoop.js";
import Keyboard, { KeyboardKey } from "../core/browser/input/keyboard.js";
import Mouse from "../core/browser/input/mouse.js";
import Vector, { VectorZero } from "../core/math/vector.js";

import CoordinateText from "./game/coordinateText.js";

import Player from "./game/player.js";
import Bullet from "./game/bullet.js";
import Zombie from "./game/zombie.js";

import MockServer from "../server/index.js";

import GunUI from "./ui/gunUI.js";
import FpsUI from "./ui/fpsUI.js";

import PlayerActionRequestModel from "../dto/playerActionRequest.js";
import { ServerWorldMessageModel } from "../dto/serverWorldMessage.js";

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const context: CanvasRenderingContext2D = canvas.getContext("2d");

const game: GameLoop = new GameLoop(canvas, update, draw);

const map: {
    width: number;
    height: number;
} = {
    width: 0,
    height: 0
};

const otherPlayers: { [index: string]: Player; } = {};
const zombies: { [index: string]: Zombie; } = {};
const bullets: Bullet[] = [];

const player: Player = new Player({
    id: null,
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
const playerRequest: PlayerActionRequestModel = {
    moveDirection: VectorZero(),
    rotation: 0,
    shoot: false,
    reload: false
}

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

    playerRequest.moveDirection = moveDirection;
    playerRequest.rotation = playerRotation;

    Camera.position = player.position;

    // Gun update -----------
    if(!player.gun) { return; }

    if(Keyboard.getKeyHold(KeyboardKey.R)) { playerRequest.reload = true; }

    if(Mouse.getButtonDown(0)) {
        if(player.gun.getAmmo() === 0) {
            playerRequest.reload = true;
        } else {
            playerRequest.shoot = true;
        }
    }

    // Send request to server
    sendRequestToServer();
}

function draw(deltaTime: number) {
    if(!player) { return; }

    for (let x = -(map.width / 2); x <= (map.width/ 2); x++) {
        for (let y = -(map.height / 2); y <= (map.height / 2); y++) {
            new CoordinateText({ x: x, y: y }).render(context);
        }
    }

    // Mouse position displayer
    const mousePos = Camera.projectScreenToWorld(Mouse.getScreenPosition());
    new CoordinateText(mousePos).render(context);

    // Draw bullets
    bullets.forEach((bullet) => bullet.render(context));

    // Draw zombies
    for (let key in zombies) {
        zombies[key].render(context);
    }

    // Draw other players
    for (let key in otherPlayers) {
        otherPlayers[key].render(context);
    }

    // Draw player
    player.render(context);

    gunUI.render(context, player.gun.state.current);
    FPS.render(context, deltaTime);

    // Clear bullets
    bullets.length = 0;
}

// Request --------------------
function sendRequestToServer() {
    mockServer.clientMessage(JSON.stringify(playerRequest));

    // Reset request buffer
    playerRequest.moveDirection = VectorZero();
    playerRequest.shoot = false;
    playerRequest.reload = false;
}

// Server --------------------
const mockServer: MockServer = new MockServer(onServerMessage);

function onServerMessage(data: string) {
    const serverData = (JSON.parse(data) as ServerWorldMessageModel);

    // Update player
    player.updateState(serverData.player);

    // Update map size
    map.width = serverData.world.map.width;
    map.height = serverData.world.map.height;

    // Create bullets
    serverData.world.bullets.forEach((item) => {
        bullets.push(new Bullet(item));
    });

    // Create/Update players
    serverData.world.players.forEach((playerData) => {
        if(player.state.current.id === playerData.id) { return; } // Do not include our player in otherPlayers list

        const otherPlayer = otherPlayers[playerData.id];

        if(otherPlayer) {
            otherPlayer.updateState(playerData)
        } else {
            otherPlayers[playerData.id] = new Player(playerData);
        }
    });

    // Destroy other players entities which were not updated in the last 50ms since last server update
    for (let key in otherPlayers) {
        const lastUpdate = otherPlayers[key].state.lastUpdate;

        if((Date.now() - lastUpdate) > 50) {
            delete otherPlayers[key];
        }  
    }

    // Create/Update zombies
    serverData.world.zombies.forEach((zombieData) => {
        const zombie = zombies[zombieData.id];

        if(zombie) {
            zombie.updateState(zombieData)
        } else {
            zombies[zombieData.id] = new Zombie(zombieData);
        }
    });

    // Destroy zombie entities which were not updated in the last 50ms since last server update
    for (let key in zombies) {
        const lastUpdate = zombies[key].state.lastUpdate;

        if((Date.now() - lastUpdate) > 50) {
            delete zombies[key];
        }  
    }
}