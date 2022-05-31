import { WAMessage, WASocket } from "@adiwajshing/baileys";
import { Command } from "./command";

export class CommandHandler {
    private commands: Array<Command> = [];
    private client: WASocket;

    constructor(client: WASocket) {
        this.client = client;
    }

    public findCommands(text: string) {
        const commands: Array<Command> = [];
        this.commands.forEach(command => {
            if (text.startsWith(command.command)) {
                commands.push(command);
            }
        });

        return commands;
    }

    public executeCommands(message: WAMessage, ...commands: Array<Command>) {
        commands.forEach(command => {
            command.execute(this.client, message);
        });
    }

    public registerCommand(command: Command) {
        this.commands.push(command);
    }
}