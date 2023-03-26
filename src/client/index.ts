import Camera from "../core/browser/game/camera";
import GameLoop from "../core/browser/game/gameLoop";
import Keyboard, { KeyboardKey } from "../core/browser/input/keyboard";
import Mouse from "../core/browser/input/mouse";
import Vector, { VectorZero } from "../core/math/vector";

import CoordinateText from "./game/coordinateText";

import Player from "./game/player";
import Bullet from "./game/bullet";
import Zombie from "./game/zombie";

import GunUI from "./ui/gunUI";
import FpsUI from "./ui/fpsUI";

import { CLIENT_MESSAGE_TYPE, ClientMessage } from "../dto/clientMessage";
import { SERVER_MESSAGE_TYPE, ServerMessage } from "../dto/serverMessage";

import { GameObjectEntityList } from "./gameObjectEntity";
import PlayerModel from "../model/player";
import ZombieModel from "../model/zombie";
import { ClientPlayerAction } from "../dto/clientAction";
import { ServerPlayerConnected } from "../dto/serverNewConnection";
import { ServerWorldUpdate } from "../dto/serverUpdate";
import Entity from "../dto/entity";
import SingleplayerServer from "../server/variants/singleplayerServer";

document.getElementById("respawn-button")!.onclick = requestRespawn;

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const context: CanvasRenderingContext2D = canvas.getContext("2d")!;

const game: GameLoop = new GameLoop(canvas, update, draw);

const map: {
    width: number;
    height: number;
} = {
    width: 0,
    height: 0
};

const otherPlayers = new GameObjectEntityList<Player, Entity<PlayerModel>>({
    createGameObject: (entity) => new Player(entity.data),
    updateEntity: (go, entity) => go.updateState(entity.data)
});

const zombies = new GameObjectEntityList<Zombie, Entity<ZombieModel>>({
    createGameObject: (entity) => new Zombie(entity.data),
    updateEntity: (go, entity) => go.updateState(entity.data)
});

const bullets: Bullet[] = [];

let player: (Player | null) = null;
let playerEntity: (Entity<PlayerModel> | null) = null;

const playerRequest: ClientPlayerAction = {
    moveDirection: VectorZero(),
    rotation: 0,
    shoot: false,
    reload: false
}

const FPS: FpsUI = new FpsUI();
const gunUI: GunUI = new GunUI();

function updatePlayerInput() {
    // Player update -----------
    if (!player) { return; }

    const mousePos = Camera.projectScreenToWorld(Mouse.getScreenPosition());

    const moveDirection: Vector = VectorZero();
    if (Keyboard.getKeyHold(KeyboardKey.ArrowRight) || Keyboard.getKeyHold(KeyboardKey.D)) { moveDirection.x += 1; }
    if (Keyboard.getKeyHold(KeyboardKey.ArrowLeft) || Keyboard.getKeyHold(KeyboardKey.A)) { moveDirection.x -= 1; }
    if (Keyboard.getKeyHold(KeyboardKey.ArrowUp) || Keyboard.getKeyHold(KeyboardKey.W)) { moveDirection.y += 1; }
    if (Keyboard.getKeyHold(KeyboardKey.ArrowDown) || Keyboard.getKeyHold(KeyboardKey.S)) { moveDirection.y -= 1; }

    const playerRotation: number = Math.atan2(
        -(mousePos.y - player.position.y),
        (mousePos.x - player.position.x)
    );

    playerRequest.moveDirection = moveDirection;
    playerRequest.rotation = playerRotation;

    Camera.position = player.position;

    // Gun update -----------
    if (!player.gun) { return; }

    if (Keyboard.getKeyHold(KeyboardKey.R)) { playerRequest.reload = true; }

    if (Mouse.getButtonDown(0)) {
        if (player.gun.getAmmo() === 0) {
            playerRequest.reload = true;
        } else {
            playerRequest.shoot = true;
        }
    }

    // Send request to server
    sendUpdateToServer();
}

function update(deltaTime: number) {
    if (!player) { return; }

    updatePlayerInput();

    player.update(deltaTime);
    zombies.forEach((zombie) => zombie.gameObject.update(deltaTime));
    otherPlayers.forEach((otherPlayer) => otherPlayer.gameObject.update(deltaTime));
}

function draw(deltaTime: number) {
    if (!player) { return; }

    for (let x = -(map.width / 2); x <= (map.width / 2); x++) {
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
        if (otherPlayer.id === playerEntity?.id) { return; }

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
function sendUpdateToServer() {
    if(!playerEntity) { return; }

    const payload: ClientMessage<ClientPlayerAction> = {
        playerId: playerEntity.id,
        type: CLIENT_MESSAGE_TYPE.UPDATE,
        data: playerRequest
    };

    mockServer.onClientMessage(JSON.stringify(payload));
}

function requestRespawn() {
    if(!player) { return; }
    if(!playerEntity) { return; }
    if(player.state.current.health > 0) { return }

    const request: ClientMessage = {
        playerId: playerEntity.id,
        type: CLIENT_MESSAGE_TYPE.REQUEST_RESPAWN,
        data: null
    }
    mockServer.onClientMessage(JSON.stringify(request));
}

// Server --------------------
const mockServer: SingleplayerServer = new SingleplayerServer(onServerMessageReceived);

const connectionRequest: ClientMessage = {
    playerId: "null",
    type: CLIENT_MESSAGE_TYPE.REQUEST_CONNECTION,
    data: null
}
mockServer.onClientMessage(JSON.stringify(connectionRequest));

function onServerMessageReceived(data: string) {
    const message: ServerMessage = JSON.parse(data);

    if (message.type === SERVER_MESSAGE_TYPE.ON_CONNECTED) {
        const serverData = message.data as unknown as ServerPlayerConnected;

        playerEntity = serverData.player;
        player = new Player(playerEntity.data);

        return;
    }

    //---------------------------- SERVER_MESSAGE_TYPE.UPDATE ----------------------------
    if(!player) { return; }

    const serverData = message.data as unknown as ServerWorldUpdate;

    // Update player
    player.updateState(serverData.player.data);
    document.getElementById("respawn-modal")!.style.display = (player.state.current.health > 0) ? "none" : "flex";

    // Update map size
    map.width = serverData.world.map.width;
    map.height = serverData.world.map.height;

    // Create bullets
    serverData.world.bullets.forEach((item) => {
        bullets.push(new Bullet(item));
    });

    zombies.onServerUpdate(serverData.world.zombies);
    otherPlayers.onServerUpdate(serverData.world.players);



    //---------------------------- CLEAR ACTION BUFFER ----------------------------

    // Reset request buffer
    playerRequest.moveDirection = VectorZero();
    playerRequest.shoot = false;
    playerRequest.reload = false;
}