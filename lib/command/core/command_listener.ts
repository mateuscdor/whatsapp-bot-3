import {proto, WASocket} from "@adiwajshing/baileys";
import {prefix as bot_prefix} from "../../config";
import {IListener} from "../../listener/core/listener";
import {getMessageBody} from "../../utils/message_utils";
import {CommandHandler} from "./command_handler";

export default class CommandListener implements IListener {
  private commandHandler: CommandHandler;
  constructor(commandHandler: CommandHandler) {
    this.commandHandler = commandHandler;
  }

  filter(message: proto.IWebMessageInfo): boolean {
    const body = getMessageBody(message);
    return body?.startsWith(bot_prefix) ?? false;
  }

  execute(client: WASocket, message: proto.IWebMessageInfo): void {
    const body = getMessageBody(message);
    const command_text = body?.substring(bot_prefix.length).toLowerCase();
    const commands = this.commandHandler.findCommands(command_text ?? "");
    this.commandHandler.executeCommands(message, ...commands);
  }
}
