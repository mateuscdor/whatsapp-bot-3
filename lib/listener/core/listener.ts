import { proto, WAMessage, WASocket } from "@adiwajshing/baileys";
import Listed from "../../listed";

/**
 * If blacklist is empty it is considered inactive.
 * Whitelist trumps blacklist in priority.
 * If whitelist is empty it is considered inactive.
 * You can only whitelist a person but you can blacklist a group.
 */
export abstract class IListener extends Listed {
  filter(message: WAMessage): boolean {
    throw new Error("Not implemented");
  }
  execute(client: WASocket, message: WAMessage): void {
    throw new Error("Not implemented");
  }
}

export class Listener extends IListener {
  blacklist: string[];
  whitelist: string[];

  filterer: (message: WAMessage) => boolean;
  executor: (client: WASocket, message: proto.IWebMessageInfo) => void;

  constructor(
    filterer: (message: WAMessage) => boolean,
    executor: (client: WASocket, message: proto.IWebMessageInfo) => void,
    blacklist: string[] = [],
    whitelist: string[] = []
  ) {
    super()
    this.blacklist = blacklist;
    this.whitelist = whitelist;
    this.filterer = filterer;
    this.executor = executor;
  }

  filter(message: WAMessage): boolean {
    return this.filterer(message);
  }

  execute(client: WASocket, message: proto.IWebMessageInfo): void {
    return this.executor(client, message);
  }
}
