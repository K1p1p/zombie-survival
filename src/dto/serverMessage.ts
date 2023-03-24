export enum SERVER_MESSAGE_TYPE {
    ON_CONNECTED,
    UPDATE
}

export interface ServerMessage<T=any> {
    type: SERVER_MESSAGE_TYPE;
    data: T;
}