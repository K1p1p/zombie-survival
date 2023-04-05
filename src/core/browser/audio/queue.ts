import { clamp } from "../../math/index";

// TODO: Replace oldest if no free channel is found
export class AudioQueue {
    private array: {
        audio: HTMLAudioElement;
        source: MediaElementAudioSourceNode;
        panner: StereoPannerNode;
    }[] = []

    constructor(context: AudioContext) {
        const MAX_CONCURRENT_AUDIO: number = 50;
        
        for (let index = 0; index < MAX_CONCURRENT_AUDIO; index++) {
            const audio = new Audio();
            const source = context.createMediaElementSource(audio);
            const panner = context.createStereoPanner();

            source.connect(panner);
            panner.connect(context.destination);

            this.array.push({
                audio: audio,
                source: source,
                panner: panner,
            });
        }
    }

    play(src: string, volume: number=1, pan: number=0) {
        const target = this.array.find((item) => (item.audio.duration === 0 || item.audio.paused || item.audio.ended));

        if(!target) { return; }

        target.panner.pan.value = clamp(pan, -1, 1);

        target.audio.src = src;
        target.audio.volume = clamp(volume, 0, 1);
        target.audio.play();
    }
}