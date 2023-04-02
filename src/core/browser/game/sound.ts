import { clamp } from "../../math/index";

export default class Sound {
    private static context: AudioContext = new AudioContext();

    public static playOnce(src: string, volume: number=1, pan: number=0) {
        const audio = new Audio(src);
        audio.volume = volume;

        let source = Sound.context.createMediaElementSource(audio);

        let panner = Sound.context.createStereoPanner();
        panner.pan.value = clamp(pan, -1, 1);

        source.connect(panner);
        panner.connect(Sound.context.destination);

        audio.play();

        audio.onended = () => {
            source.disconnect();
            panner.disconnect();

            audio.remove();
        }
    }
}