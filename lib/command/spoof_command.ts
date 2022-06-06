import {
    AnyMessageContent,
    generateMessageID,
    generateWAMessageFromContent,
    proto,
    WAMessage,
    WASocket,
} from "@adiwajshing/baileys";
import { prefix as bot_prefix } from "../config";
import { getMessageBody } from "../utils/message_utils";
import { ICommand } from "./core/command";

export default class SpoofCommand extends ICommand {
    command: string = "spoof";
    async execute(client: WASocket, message: proto.IWebMessageInfo) {
        const body = getMessageBody(message)?.slice(bot_prefix.length + this.command.length + 1);
        const mentioned = body?.split(" ")[0].slice(1);
        const quotes = [...(body!.matchAll(RegExp(/"(.*?)"/, "g")))];
        if (!body || quotes?.length != 2) {
            return await this.error(client, message);
        }

        
        message.key.participant = mentioned + '@s.whatsapp.net'
        if (message.message!.extendedTextMessage) message.message!.extendedTextMessage!.text = quotes[0][1];
        message.message!.conversation = quotes[0][1];

        await client.sendMessage(message.key.remoteJid!, {text: quotes[1][1]}, {quoted: message})
    }

    private async error(client: WASocket, message: proto.IWebMessageInfo) {
        return await client.sendMessage(message.key.remoteJid!, { text: 'Must follow >>spoof <tag> "<spoofed message>" "<user message>"' })

    }
}
