export default class Sound {
    public static playOnce(src: string) {
        const audio = new Audio(src);
        audio.play();
    }
}