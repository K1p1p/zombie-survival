import Vector from "../../core/math/vector";
import GameObject from "../game/gameObject";

export function getNearestGameObjectFromVector<T extends GameObject>(gameObjects: T[], vector: Vector): T | null {
    if(gameObjects.length === 0) { return null; }

    let nearestGameObject: T = gameObjects[0];
    let nearestGameObjectDistance: number = Number.POSITIVE_INFINITY;

    gameObjects.forEach((value) => {
        const distanceFromVector: number = Vector.magnitude({ 
            x: (value.transform.position.x - vector.x),
            y: (value.transform.position.y - vector.y),
        });

        // Set new nearest object
        if(distanceFromVector < nearestGameObjectDistance) {
            nearestGameObject = value;
            nearestGameObjectDistance = distanceFromVector;
        }
    });

    return nearestGameObject;
}