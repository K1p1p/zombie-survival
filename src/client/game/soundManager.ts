import Camera from "../../core/browser/game/camera";
import Sound from "../../core/browser/game/sound";
import { lerp } from "../../core/math/index";
import Vector from "../../core/math/vector";

export default class SoundManager {
    public static playGunshot(position: Vector) {
        Sound.playOnce(
            "sfx/gunshot.mp3", 
            SoundManager.volumeForDistance(0.1, position),
            SoundManager.soundPanning(position)
        );
    }

    public static playReload(position: Vector) {
        Sound.playOnce(
            "sfx/reload.wav", 
            SoundManager.volumeForDistance(0.05, position),
            SoundManager.soundPanning(position)
        );
    }

    private static volumeForDistance(volume: number, soundPosition: Vector) {
        const MAX_AUDIBLE_DISTANCE: number = 15;

        const distance: number = Vector.distance(soundPosition, Camera.position);

        return lerp(0, volume, (1 - (distance / MAX_AUDIBLE_DISTANCE)));
    }

    private static soundPanning(soundPosition: Vector): number {
        const MAX_PAN_DISTANCE: number = 5;

        const delta: Vector = Vector.delta(soundPosition, Camera.position);

        return lerp(0, 1, (delta.x / MAX_PAN_DISTANCE));
    }
}