export enum MessageStatus {
    Sent = 0,
    Received = 1,
    Read = 2,
    error = 3
}

export interface Message {
    content: string;
    status: MessageStatus;
    receivedAt: Date;
    sentAt: Date;
    receiverUsername: string;
    senderUsername: string;
}