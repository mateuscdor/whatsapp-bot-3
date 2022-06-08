import { WASocket } from "@adiwajshing/baileys";

export async function getUserGroupLevel(client: WASocket, jid: string, id: string): Promise<number> {
    if (!isGroup(jid)) return -1;

    const groupAdminMap = await getAdminMap(client, jid);

    return groupAdminMap[id] ?? 0;
}

export async function getAdminMap(client: WASocket, jid: string) {
    const map = {};

    const groupMeta = await client.groupMetadata(jid);
    for (const participant of groupMeta.participants) {
        map[participant.id] = participant.admin == "superadmin" ? 2 : participant.admin == "admin" ? 1 : 0
    }

    return map;
}


export async function getBotGroupLevel(client: WASocket, jid: string): Promise<number> {
    const groupAdminMap = await getAdminMap(client, jid);

    return groupAdminMap[getClientID(client)] ?? 0
}

export function isGroup(jid: string) {
    return jid.endsWith("@g.us");
}

export function normalizeUserId(id: string): string {
    return id.split(":")[0] + "@s.whatsapp.net";
}

export function getClientID(client: WASocket): string {
    return normalizeUserId(client.user.id);
}