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

export function inverseLerp(a: number, b: number, value: number): number {
    if (a !== b) {
        return (value - a) / (b - a);
    } else {
        return 0.0;
    }
}

export function fract(value: number): number {
    return (value - Math.floor(value));
}

/**
 * Loops the value, so that it is never larger than length and never smaller than 0.
 * @param value Positive value.
 * @param length Positive value larger than zero.
 */
export function repeat(value: number, length: number): number {
    return (value % length);
}

/**
 * Loops the value | min(inclusive) max(exclusive)
 * @param value Positive value.
 * @param min Positive value larger than zero. (Inclusive)
 * @param max Positive value larger than zero. (Exclusive)
 */
export function repeatRange(value: number, min: number, max: number): number {
    const delta = Math.abs(max - min);

    return min + repeat(value, delta);
}

/**
 * Loops the value, so that it is never larger than length and never smaller than 0.
 * @param value Value.
 * @param length Positive value larger than zero.
 */
export function loop(value: number, length: number): number {
    if(value < 0) {
        value = (length - (Math.abs(value) % length));

        if(value == length) { return 0; }

        return value;
    }

    return (value % length);
}