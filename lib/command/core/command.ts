import { proto, WAMessage, WASocket } from "@adiwajshing/baileys";
import Listed from "../../listed";

export abstract class ICommand extends Listed {
  blacklist: string[] = [];
  whitelist: string[] = [];

  command: string = "default";
  execute(client: WASocket, message: WAMessage): void {
    throw new Error("Not implemented");
  }
}

export class Command extends ICommand {
  command: string;
  executor: (client: WASocket, message: proto.IWebMessageInfo) => void;

  constructor(
    command: string,
    executor: (client: WASocket, message: proto.IWebMessageInfo) => void,
    blacklist: string[] = [],
    whitelist: string[] = []
  ) {
    super()
    this.whitelist = whitelist;
    this.blacklist = blacklist;
    this.command = command;
    this.executor = executor;
  }

  execute(client: WASocket, message: proto.IWebMessageInfo): void {
    return this.executor(client, message);
  }
}
