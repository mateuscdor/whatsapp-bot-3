import { WASocket } from "@adiwajshing/baileys";

export async function isGroupAdmin(client: WASocket, jid: string, id: string): Promise<boolean> {
    if (!jid.endsWith('@g.us')) return false;

    const groupMeta = await client.groupMetadata(jid);
    let isAdmin = false;
    for (const participant of groupMeta.participants) {
        if (participant.id == id && participant.admin) {
            isAdmin = true;
        }
    }

    return isAdmin;
}