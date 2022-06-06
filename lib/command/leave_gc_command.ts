import { proto, WASocket } from "@adiwajshing/baileys";
import { ICommand } from "./core/command";

export default class LeaveCommand extends ICommand {
    command: string = "gtfo";
    async execute(client: WASocket, message: proto.IWebMessageInfo) {
        const groupMeta = await client.groupMetadata(message.key.remoteJid!);

        console.log(groupMeta.participants)
        for (const participant of groupMeta.participants) {
            if (participant.id == message.key.participant && participant.admin) {
                await client.sendMessage(message.key.remoteJid!, { text: "Leaving the group chat...\nPeace out ✌️" })
                return await client.groupLeave(groupMeta.id);
            }
        }

        client.sendMessage(message.key.remoteJid!, {text: "Only a group admin can run this command."})
    }
}
