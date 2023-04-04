import GameWorld from "./gameWorld";

export default class ThreatManager {
    currentThreatLevel: number = 0;
    desiredThreatLevel: number = 0;
    //individualThreatLevel: number; // Only spawn enemies maxing at this threat level 

    world: GameWorld;

    startTime: number;

    minThreatPerPlayer: number = 15;
    maxThreatPerPlayer: number = 35;

    minThreatLevel: number = this.minThreatPerPlayer;
    maxThreatLevel: number = this.maxThreatPerPlayer;

    constructor(world: GameWorld) {
        this.world = world;
        this.startTime = Date.now();
    }

    update() {
        const nPlayers: number = Object.values(this.world.players).length;
        this.minThreatLevel = (nPlayers * this.minThreatPerPlayer);
        this.maxThreatLevel = (nPlayers * this.maxThreatPerPlayer);

        this.currentThreatLevel = 0;
        Object.values(this.world.zombies).forEach((zombie) => (this.currentThreatLevel += zombie.threatValue));

        const timeSinceStart: number = (Date.now() - this.startTime);
        const curveTime: number = 60; // In seconds
        const t = Math.abs(Math.sin(timeSinceStart / (1000 * curveTime))); 
        const d = (this.maxThreatLevel - this.minThreatLevel); 

        this.desiredThreatLevel = (this.minThreatLevel + (d * t));
    }

    shouldCreateNewZombies(): boolean {
        return (this.currentThreatLevel < this.desiredThreatLevel);
    }
}