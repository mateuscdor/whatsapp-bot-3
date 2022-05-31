import { WAMessage, WASocket } from "@adiwajshing/baileys";

export interface Command {
	command: string;
    execute(client: WASocket, message: WAMessage): void;
}
