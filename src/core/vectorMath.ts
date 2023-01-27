export function moveTowards(current, target, maxDelta)
{
    const deltaX = (target.x - current.x);
    const deltaY = (target.y - current.y);
    const magnitude = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));

    if (magnitude <= maxDelta || magnitude == 0)
    {
        return target;
    }

    return {
        x: current.x + deltaX / magnitude * maxDelta,
        y: current.y + deltaY / magnitude * maxDelta,
    }
}