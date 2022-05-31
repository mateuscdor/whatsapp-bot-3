import { proto, WAMessage, WASocket } from "@adiwajshing/baileys";

export interface IListener {
    filter(message: WAMessage): boolean;
    execute(client: WASocket, message: WAMessage): void;
}

export class Listener implements IListener {
    filterer: (message: WAMessage) => boolean;
    executor: (client: WASocket, message: proto.IWebMessageInfo) => void;
  
    constructor(
        filterer: (message: WAMessage) => boolean,
      executor: (client: WASocket, message: proto.IWebMessageInfo) => void
    ) {
      this.filterer = filterer;
      this.executor = executor;
    }
  
    filter(message: WAMessage): boolean {
        return this.filter(message);
    }

    execute(client: WASocket, message: proto.IWebMessageInfo): void {
      return this.executor(client, message);
    }
  }