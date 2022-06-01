import {proto, WASocket} from "@adiwajshing/baileys";
import { isFunctionOrConstructorTypeNode } from "typescript";
import { prefix as bot_prefix } from "../config";
import {getMessageBody} from "../utils/message_utils";
import {ICommand} from "./core/command";

export class CodeCommand implements ICommand {
  command: string = "code";
  execute(client: WASocket, message: proto.IWebMessageInfo): void {
    client.sendMessage(
      message.key.remoteJid!,
      {text: "https://github.com/Heknon/whatsapp-bot"},
      {quoted: message}
    );
  }
}

export class ShutdownCommand implements ICommand {
  command: string = "shutdown";
  execute(client: WASocket, message: proto.IWebMessageInfo): void {
    client.sendMessage(
      message.key.remoteJid!,
      {text: "Shutting down..."},
      {quoted: message}
    );
    
    throw 'Shutting down...';
  }
}
