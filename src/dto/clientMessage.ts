import Vector from "../core/math/vector.js";

export enum CLIENT_MESSAGE_TYPE {
    REQUEST_CONNECTION,
    UPDATE
}

export interface ClientMessageModel<T=any> {
    type: CLIENT_MESSAGE_TYPE;
    data: T;
}

export interface ClientPlayerActionModel {
    moveDirection: Vector;
    rotation: number; // Radians
    shoot: boolean;
    reload: boolean;
}