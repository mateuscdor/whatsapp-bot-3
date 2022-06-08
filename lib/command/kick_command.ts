import {
    proto,
    WASocket,
} from "@adiwajshing/baileys";
import { isGroupAdmin } from "../utils/group_utils";
import { ICommand } from "./core/command";

export default class KickCommand extends ICommand {
    command: string = "kick";
    async execute(client: WASocket, message: proto.IWebMessageInfo) {
        const isAdmin: boolean = await isGroupAdmin(client, message.key.remoteJid ?? '', message.key.participant ?? '');
        const iAmAdmin: boolean = await isGroupAdmin(client, message.key.remoteJid ?? '', client.user.id.split(":")[0] + "@s.whatsapp.net" ?? '');

        if (!iAmAdmin) {
            return client.sendMessage(message.key.remoteJid!, { text: "Give the bot admin access in order to use this command." }, { quoted: message })
        }

        if (!isAdmin) {
            return client.sendMessage(message.key.remoteJid!, { text: "Only a group admin can run this command." }, { quoted: message })
        }

        const kickList = message.message?.extendedTextMessage?.contextInfo?.mentionedJid ?? [];
        await client.groupParticipantsUpdate(message.key.remoteJid!, kickList, 'remove')
        return client.sendMessage(message.key.remoteJid!, { text: "Success 🎉🥳🥳" }, { quoted: message })
    }
}
