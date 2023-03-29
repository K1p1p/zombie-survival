import Sound from "../../core/browser/game/sound";

export default class SoundManager {
    public static playGunshot() {
        Sound.playOnce("sfx/gunshot.mp3");
    }

    public static playReload() {
        Sound.playOnce("sfx/reload.wav");
    }
}