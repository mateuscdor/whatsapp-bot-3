import {
    proto,
    WASocket,
} from "@adiwajshing/baileys";
import { isGroupAdmin } from "../utils/group_utils";
import { ICommand } from "./core/command";

export default class KickCommand extends ICommand {
    command: string = "kick";
    async execute(client: WASocket, message: proto.IWebMessageInfo) {
        const isAdmin = isGroupAdmin(client, message.key.remoteJid ?? '', message.key.participant ?? '');

        if (!isAdmin) {
            return client.sendMessage(message.key.remoteJid!, { text: "Only a group admin can run this command." }, { quoted: message })
        }

        const kickList = message.message?.extendedTextMessage?.contextInfo?.mentionedJid ?? [];
        console.log(kickList)
        await client.groupParticipantsUpdate(message.key.remoteJid!, kickList, 'remove')
        return client.sendMessage(message.key.remoteJid!, { text: "Success 🎉🥳🥳" }, { quoted: message })
    }
}
