import {
    proto,
    WASocket,
} from "@adiwajshing/baileys";
import { prefix as bot_prefix } from "../config";
import { getMessageBody } from "../utils/message_utils";
import { ICommand } from "./core/command";
import url from 'node:url';

export default class LmgtfyCommand extends ICommand {
    command: string = "lmgtfy";
    async execute(client: WASocket, message: proto.IWebMessageInfo) {
        const base_link = 'https://lmgtfy.app/?q='

        const query =
            getMessageBody(message)?.slice(
                bot_prefix.length + this.command.length + 1
            ) ?? "";

        const link = url.format(base_link + query + '&iie=1')
        client.sendMessage(message.key.remoteJid!, {text: "You couldn't Google that yourself huh?\n" + link, })
    }
}
