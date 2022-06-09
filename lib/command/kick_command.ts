import {
    proto,
    WASocket,
} from "@adiwajshing/baileys";
import { getAdminMap, getBotGroupLevel, getUserGroupLevel, getClientID } from "../utils/group_utils";
import { ICommand } from "./core/command";

export default class KickCommand extends ICommand {
    command: string = "kick";
    async execute(client: WASocket, message: proto.IWebMessageInfo) {
        const isAdmin: boolean = await getUserGroupLevel(client, message.key.remoteJid ?? '', message.key.participant ?? '') > 0;
        const iAmAdmin: boolean = await getBotGroupLevel(client, message.key.remoteJid ?? '') > 0;
        const adminMap = await getAdminMap(client, message.key.remoteJid ?? '')

        if (!iAmAdmin) {
            return client.sendMessage(message.key.remoteJid!, { text: "Give the bot admin access in order to use this command." }, { quoted: message })
        }

        if (!isAdmin) {
            return client.sendMessage(message.key.remoteJid!, { text: "Only a group admin can run this command." }, { quoted: message })
        }

        const kickListSet = new Set<string>();
        const kickList: string[] = [];
        (message.message?.extendedTextMessage?.contextInfo?.mentionedJid ?? []).forEach((kick: string) => kickListSet.add(kick))
        kickListSet.forEach((kick) => {
            if (adminMap[kick] >= 2) return;
            kickList.push(kick)
        })

        if (kickList.includes(getClientID(client))) {
            return client.sendMessage(message.key.remoteJid!, { text: "I can't kick myself 😕\nTry using >>gtfo" }, { quoted: message }) 
        }

        for (const kick of kickList) {
            await client.groupParticipantsUpdate(message.key.remoteJid!, [kick], 'remove')
        }
        return client.sendMessage(message.key.remoteJid!, { text: "Success 🎉🥳🥳" }, { quoted: message })
    }
}
