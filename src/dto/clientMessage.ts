export enum CLIENT_MESSAGE_TYPE {
    REQUEST_CONNECTION,
    UPDATE
}

export interface ClientMessage<T=any> {
    clientId: string;

    type: CLIENT_MESSAGE_TYPE;
    data: T;
}