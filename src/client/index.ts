import Camera from "../core/browser/game/camera";
import GameLoop from "../core/browser/game/gameLoop";
import Keyboard from "../core/browser/input/keyboard";
import Mouse from "../core/browser/input/mouse";
import Vector, { VectorZero } from "../core/math/vector";

import CoordinateText from "./game/coordinateText";

import Player from "./game/player";
import Bullet from "./game/bullet";
import Zombie from "./game/zombie";

import GunUI from "./ui/gunUI";
import FpsUI from "./ui/fpsUI";

import { CLIENT_MESSAGE_TYPE, ClientMessage } from "../dto/clientMessage";

import { GameObjectEntityList } from "./gameObjectEntity";
import PlayerModel from "../model/player";
import ZombieModel from "../model/zombie";
import { ClientPlayerUpdate } from "../dto/clientUpdate";
import { ServerPlayerConnected } from "../dto/serverNewConnection";
import { ServerWorldUpdate } from "../dto/serverUpdate";
import Entity from "../dto/entity";

import { MultiplayerGame } from "./server/multiplayerGame";
import { SingleplayerGame } from "./server/singleplayerGame";
import ControlsUI from "./ui/controlsUI";
import AudioManager from "../core/browser/audio/manager";
import { ServerMessage, SERVER_MESSAGE_TYPE } from "../dto/serverMessage";

let game: Game | undefined;

const serverURL = document.getElementById("server-url")!
const nickname = document.getElementById("nickname")!

nickname['value'] = localStorage.getItem('nickname') ?? 'Guest'

function createSessionModeItem(element: HTMLElement, onCheck: (() => void)) {
    if(element.id === localStorage.getItem("session-mode")) {
        element['checked'] = true;
        onCheck();
    } 

    element.onchange = () => {
        if(element['checked']) { onCheck(); }
    };
}

function setSessionMode(mode: string, valueLocalStorageKey: string, defaultValue: string) {
    localStorage.setItem("session-mode", mode);

    serverURL['value'] = localStorage.getItem(valueLocalStorageKey) ?? defaultValue;
    serverURL['disabled'] = (mode === 'singleplayer');
}

createSessionModeItem(document.getElementById("singleplayer"     )!, () => setSessionMode('singleplayer'     , ''                 , ''));
createSessionModeItem(document.getElementById("multiplayer"      )!, () => setSessionMode('multiplayer'      , 'multiplayer'      , 'ws://0.tcp.sa.ngrok.io:XXXXX'));
createSessionModeItem(document.getElementById("local-multiplayer")!, () => setSessionMode('local-multiplayer', 'local-multiplayer', 'ws://localhost:2222/'));

document.getElementById("start-button")!.onclick = () => {
    document.getElementById("start-menu-modal")!.style.display = "none";

    localStorage.setItem("nickname", nickname['value'] ?? 'Guest');
    localStorage.setItem(localStorage.getItem("session-mode") ?? '', serverURL['value']);

    AudioManager.init();

    game = new Game();
};

enum KeyboardKey {
    W = "w",
    A = "a",
    S = "s",
    D = "d",

    R = "r",

    Q = "q",
    E = "e",

    T = "t",
}

class Game {
    server: (SingleplayerGame | MultiplayerGame);

    lastMessageToServerTime: number = 0;
    lastMessageFromServerTime: number = Number.POSITIVE_INFINITY;
    shouldSendMessageToServer(): boolean { return (this.lastMessageFromServerTime > this.lastMessageToServerTime); }

    canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
    context: CanvasRenderingContext2D = this.canvas.getContext("2d")!;
    game: GameLoop;

    FPS: FpsUI = new FpsUI();
    gunUI: GunUI = new GunUI();

    player: (Player | null) = null;
    playerEntity: (Entity<PlayerModel> | null) = null;

    bullets: Bullet[] = [];

    otherPlayers: GameObjectEntityList<Player, Entity<PlayerModel>>;
    zombies: GameObjectEntityList<Zombie, Entity<ZombieModel>>;

    map: { width: number; height: number };

    playerRequest: ClientPlayerUpdate = {
        moveDirection: VectorZero(),
        rotation: 0,
        shoot: false,
        reload: false,
        switchGun: false,
        switchGunOffset: 0,
        switchGunFireMode: false
    }

    constructor() {
        this.game = new GameLoop(this.canvas, this.update.bind(this), this.draw.bind(this));
        
        document.getElementById("respawn-button")!.onclick = this.requestRespawn.bind(this);

        this.otherPlayers = new GameObjectEntityList<Player, Entity<PlayerModel>>({
            createGameObject: (entity) => new Player(entity.data),
            updateEntity: (go, entity) => go.updateState(entity.data)
        });
    
        this.zombies = new GameObjectEntityList<Zombie, Entity<ZombieModel>>({
            createGameObject: (entity) => new Zombie(entity.data),
            updateEntity: (go, entity) => go.updateState(entity.data)
        });

        this.map = { width: 0, height: 0 };

        const nickname: string = localStorage.getItem("nickname") ?? 'Guest';

        this.server = (localStorage.getItem("session-mode") === 'singleplayer') 
            ? new SingleplayerGame(nickname, this.onServerMessageReceived.bind(this))
            : new MultiplayerGame(nickname, serverURL['value'], this.onServerMessageReceived.bind(this))
    }

    updatePlayerInput() {
        // Player update -----------
        if (!this.player) { return; }
    
        const mousePos = Camera.projectScreenToWorld(Mouse.getScreenPosition());
    
        const moveDirection: Vector = VectorZero();
        if (Keyboard.getKeyHold(KeyboardKey.D)) { moveDirection.x += 1; }
        if (Keyboard.getKeyHold(KeyboardKey.A)) { moveDirection.x -= 1; }
        if (Keyboard.getKeyHold(KeyboardKey.W)) { moveDirection.y += 1; }
        if (Keyboard.getKeyHold(KeyboardKey.S)) { moveDirection.y -= 1; }
    
        const playerRotation: number = Math.atan2(
            -(mousePos.y - this.player.position.y),
            (mousePos.x - this.player.position.x)
        );
    
        this.playerRequest.moveDirection = moveDirection;
        this.playerRequest.rotation = playerRotation;
    
        Camera.position = this.player.position;
    
        // Gun update -----------
        if (!this.player.gun) { return; }
    
        if (Keyboard.getKeyDown(KeyboardKey.R)) { this.playerRequest.reload = true; }
    
        if (Mouse.getButtonDown(0)) {
            if (this.player.gun.getAmmo() === 0) {
                this.playerRequest.reload = true;
            } else {
                this.playerRequest.shoot = true;
            }
        } else if (Mouse.getButtonUp(0)) {
            this.playerRequest.shoot = false;
        }
    
        if (Mouse.getButtonDown(1) || Keyboard.getKeyDown(KeyboardKey.T)) {
            this.playerRequest.switchGunFireMode = true;
        }
    
        if (Keyboard.getKeyDown(KeyboardKey.Q)) { 
            this.playerRequest.switchGun = true; 
            this.playerRequest.switchGunOffset = -1;
        }
        else if (Keyboard.getKeyDown(KeyboardKey.E)) { 
            this.playerRequest.switchGun = true; 
            this.playerRequest.switchGunOffset = 1;
        }
    
        if (Mouse.getMouseWheelDelta() !== 0) {
            this.playerRequest.switchGun = true;
            this.playerRequest.switchGunOffset = Mouse.getMouseWheelDelta();
        }
    }
    
    update(deltaTime: number) {
        if (!this.player) { return; }
    
        this.updatePlayerInput();
    
        this.player.update(deltaTime);
        this.zombies.forEach((zombie) => zombie.gameObject.update(deltaTime));
        this.otherPlayers.forEach((otherPlayer) => otherPlayer.gameObject.update(deltaTime));
    
        // Send updates to server
        if (this.shouldSendMessageToServer()) {
            this.sendUpdateToServer();
    
            // Reset request buffer
            this.playerRequest.switchGun = false;
            this.playerRequest.reload = false;
            this.playerRequest.switchGunFireMode = false;
        }
    }
    
    draw(deltaTime: number) {
        if (!this.player) { return; }
    
        for (let x = -(this.map.width / 2); x <= (this.map.width / 2); x++) {
            for (let y = -(this.map.height / 2); y <= (this.map.height / 2); y++) {
                new CoordinateText({ x: x, y: y }).render(this.context);
            }
        }
    
        // Mouse position displayer
        const mousePos = Camera.projectScreenToWorld(Mouse.getScreenPosition());
        new CoordinateText(mousePos).render(this.context);
    
        // Draw bullets
        this.bullets.forEach((bullet) => bullet.render(this.context));
    
        // Draw zombies
        this.zombies.forEach((zombie) => zombie.gameObject.render(this.context));
    
        // Draw other players
        this.otherPlayers.forEach((otherPlayer) => {
            if (otherPlayer.id === this.playerEntity?.id) { return; }
    
            otherPlayer.gameObject.render(this.context);
        });
    
        // Draw player
        this.player.render(this.context);
    
        this.gunUI.render(this.context, this.player.gun.state.current);
        this.FPS.render(this.context, deltaTime);
        ControlsUI.render(this.context)
    
        // Clear bullets
        this.bullets.length = 0;
    }
    
    // Request --------------------
    sendUpdateToServer() {
        if (!this.playerEntity) { return; }
    
        const payload: ClientMessage<ClientPlayerUpdate> = {
            playerId: this.playerEntity.id,
            type: CLIENT_MESSAGE_TYPE.UPDATE,
            data: this.playerRequest
        };
    
        this.server.sendMessage(JSON.stringify(payload));
    
        this.lastMessageToServerTime = Date.now();
    }
    
    requestRespawn() {
        if (!this.player) { return; }
        if (!this.playerEntity) { return; }
        if (this.player.state.current.health > 0) { return }
    
        const request: ClientMessage = {
            playerId: this.playerEntity.id,
            type: CLIENT_MESSAGE_TYPE.REQUEST_RESPAWN,
            data: null
        }
    
        this.server.sendMessage(JSON.stringify(request));
    
        this.lastMessageToServerTime = Date.now();
    }
    
    //---------------------------- SERVER ----------------------------
    
    onServerMessageReceived(data: string) {
        this.lastMessageFromServerTime = Date.now();
    
        const message: ServerMessage = JSON.parse(data);
    
        if (message.type === SERVER_MESSAGE_TYPE.ON_CONNECTED) {
            const serverData = message.data as unknown as ServerPlayerConnected;
    
            this.playerEntity = serverData.player;
            this.player = new Player(this.playerEntity.data);
    
            return;
        }
    
        //---------------------------- SERVER_MESSAGE_TYPE.UPDATE ----------------------------
        if (!this.player) { return; }
        if (!this.playerEntity) { return; }
    
        const serverData = message.data as unknown as ServerWorldUpdate;
    
        // Update player
        this.player.updateState(serverData.player.data);
        document.getElementById("respawn-modal")!.style.display = (this.player.state.current.health > 0) ? "none" : "flex";
    
        // Update map size
        this.map.width = serverData.world.map.width;
        this.map.height = serverData.world.map.height;
    
        // Create bullets
        serverData.world.bullets.forEach((item) => {
            this.bullets.push(new Bullet(item));
        });
    
        this.zombies.onServerUpdate(serverData.world.zombies);
        this.otherPlayers.onServerUpdate(serverData.world.players);
    }
}