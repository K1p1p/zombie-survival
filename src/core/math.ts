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


