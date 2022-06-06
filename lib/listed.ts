import { WAMessage } from "@adiwajshing/baileys";

export default abstract class Listed {
    blacklist: string[] = [];
    whitelist: string[] = [];

    hasPermission(message: WAMessage): boolean {
        if (this.whitelist.length > 0) {
            if (!this.whitelist.includes(message.key.participant ?? '*')) {
                return false;
            }
        }
        
        if (this.blacklist.length > 0) {
            if (this.blacklist.includes(message.key.participant ?? ' *') && !this.whitelist.includes(message.key.participant ?? ' *')) {
                return false;
            }

            if (this.blacklist.includes(message.key.remoteJid ?? '')) { 
                return false;
            }
        }

        return true;

    }
}