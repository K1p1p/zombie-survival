import Sound from "../../core/browser/game/sound.js";

export default class SoundManager {
    public static playGunshot() {
        Sound.playOnce("client/sfx/gunshot.mp3");
    }

    public static playReload() {
        Sound.playOnce("client/sfx/reload.wav");
    }
}