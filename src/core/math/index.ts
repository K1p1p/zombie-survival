export function moveTowards(current: number, target: number, maxDelta: number) {
    if (Math.abs(target - current) <= maxDelta) { return target; }

    return current + (Math.sign(target - current) * maxDelta);
}

export function clamp(value: number, min: number, max: number) {
    if(value < min) { return min; }
    if(value > max) { return max; }

    return value;
}

export function lerp(from: number, to: number, t: number) {
    return from + ((to - from) * t);
}

// [Source] https://gist.github.com/shaunlebron/8832585
export function angleLerp(current: number, target:number, t: number) {
    function shortAngleDist(current: number, target: number) {
        var max = Math.PI * 2;
        var delta = (target - current) % max;
        return (((2 * delta) % max) - delta);
    }

    return (current + (shortAngleDist(current,target) * t));
}