import { WAMessage, WASocket } from "@adiwajshing/baileys";
import { IListener } from "./listener";

export class ListenerHandler {
    private listeners: Array<IListener> = [];
    private client: WASocket;

    constructor(client: WASocket) {
        this.client = client;
    }

    public findListeners(message: WAMessage) {
        const listeners: Array<IListener> = [];
        this.listeners.forEach(listener => {
            if (listener.filter(message)) listeners.push(listener);
        });

        return listeners;
    }

    public executeListeners(message: WAMessage, ...listeners: Array<IListener>) {
        listeners.forEach(listener => {
            listener.execute(this.client, message);
        });
    }

    public registerListener(listener: IListener) {
        this.listeners.push(listener);
    }
}