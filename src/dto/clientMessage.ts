export enum CLIENT_MESSAGE_TYPE {
    REQUEST_CONNECTION,
    REQUEST_RESPAWN,
    UPDATE,
}

export interface ClientMessage<T=any> {
    playerId: string;

    type: CLIENT_MESSAGE_TYPE;
    data: T;
}