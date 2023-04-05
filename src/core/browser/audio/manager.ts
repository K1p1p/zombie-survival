import { AudioQueue } from "./queue";

export default class AudioManager {
    private static context: AudioContext | undefined;
    private static soundPoll: AudioQueue | undefined;

    public static init() {
        AudioManager.context = new AudioContext();
        AudioManager.soundPoll = new AudioQueue(AudioManager.context);
    }

    public static playOnce(src: string, volume: number=1, pan: number=0) {
        if(!AudioManager.context || !AudioManager.soundPoll) { 
            return;
        }

        AudioManager.soundPoll?.play(src, volume, pan);
    }
}