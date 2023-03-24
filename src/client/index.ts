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

import { CLIENT_MESSAGE_TYPE, ClientMessageModel, ClientPlayerActionModel } from "../dto/clientMessage.js";
import { SERVER_MESSAGE_TYPE, ServerMessageModel, ServerPlayerConnectedMessageModel, ServerWorldUpdateMessageModel } from "../dto/serverMessage.js";

import { GameObjectEntityList } from "./gameObjectEntity.js";
import PlayerModel from "../dto/player.js";
import ZombieModel from "../dto/zombie.js";

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

const otherPlayers = new GameObjectEntityList<Player, PlayerModel>({
    createGameObject: (data) => new Player(data),
    updateEntity: (go, data) => go.updateState(data)
});

const zombies = new GameObjectEntityList<Zombie, ZombieModel>({
    createGameObject: (data) => new Zombie(data),
    updateEntity: (go, data) => go.updateState(data)
});

const bullets: Bullet[] = [];

let player: Player = null;

const playerRequest: ClientPlayerActionModel = {
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
    zombies.forEach((zombie) => zombie.gameObject.render(context));

    // Draw other players
    otherPlayers.forEach((otherPlayer) => {
        if(otherPlayer.id === player.state.current.id) { return; }

        otherPlayer.gameObject.render(context);
    });

    // Draw player
    player.render(context);

    gunUI.render(context, player.gun.state.current);
    FPS.render(context, deltaTime);

    // Clear bullets
    bullets.length = 0;
}

// Request --------------------
function sendRequestToServer() {
    const payload: ClientMessageModel<ClientPlayerActionModel> = {
        clientId: player.state.current.id,
        type: CLIENT_MESSAGE_TYPE.UPDATE,
        data: playerRequest
    };

    mockServer.onClientMessageReceived(JSON.stringify(payload));

    // Reset request buffer
    playerRequest.moveDirection = VectorZero();
    playerRequest.shoot = false;
    playerRequest.reload = false;
}

// Server --------------------
const mockServer: MockServer = new MockServer(onServerMessageReceived);

const connectionRequest: ClientMessageModel = {
    clientId: null,
    type: CLIENT_MESSAGE_TYPE.REQUEST_CONNECTION,
    data: null
}
mockServer.onClientMessageReceived(JSON.stringify(connectionRequest));

function onServerMessageReceived(data: string) {
    const message: ServerMessageModel = JSON.parse(data);

    if(message.type === SERVER_MESSAGE_TYPE.ON_CONNECTED) {
        const serverData = message.data as unknown as ServerPlayerConnectedMessageModel;

        player = new Player(serverData.player);

        return;
    }

    //---------------------------- SERVER_MESSAGE_TYPE.UPDATE ----------------------------

    const serverData = message.data as unknown as ServerWorldUpdateMessageModel;

    // Update player
    player.updateState(serverData.player);

    // Update map size
    map.width = serverData.world.map.width;
    map.height = serverData.world.map.height;

    // Create bullets
    serverData.world.bullets.forEach((item) => {
        bullets.push(new Bullet(item));
    });

    zombies.onServerUpdate(serverData.world.zombies);
    otherPlayers.onServerUpdate(serverData.world.players);
}