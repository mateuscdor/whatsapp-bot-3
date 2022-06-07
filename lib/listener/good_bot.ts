import {
    proto,

    WASocket,
} from "@adiwajshing/baileys";
import { getMessageBody } from "../utils/message_utils";
import { IListener } from "./core/listener";

export default class GoodBotListener extends IListener {
    filter(message: proto.IWebMessageInfo): boolean {
        const body = getMessageBody(message)?.toLowerCase();
        return body?.includes("good bot") ?? false;
    }

    async execute(client: WASocket, message: proto.IWebMessageInfo) {
        client.sendMessage(
            message.key.remoteJid!,
            {
                text: "😊",
            },
            { quoted: message }
        );
    }
}
