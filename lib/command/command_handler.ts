import {WAMessage, WASocket} from "@adiwajshing/baileys";
import {ListenerHandler} from "../listener/listener_handler";
import {ICommand} from "./command";
import CommandListener from "./command_listener";

export class CommandHandler {
  private commands: Array<ICommand> = [];
  private client: WASocket;
  private registeredListener = false;

  /**
   * @param client whatsapp client socket to pass to commands
   * @param listenerHandler listener handler to enable command listening. must be passed or instatiated with `registerCommandListener`
   */
  constructor(client: WASocket, listenerHandler: ListenerHandler | undefined | null = undefined) {
    this.client = client;

    if (listenerHandler) {
      this.registerCommandListener(listenerHandler);
    }
  }

  public registerCommandListener(listenerHandler: ListenerHandler) {
    if (this.registeredListener) return;

    listenerHandler.registerListener(new CommandListener(this));
    this.registeredListener = true;
  }

  public findCommands(text: string) {
    const commands: Array<ICommand> = [];
    this.commands.forEach((command) => {
      if (text.startsWith(command.command)) {
        commands.push(command);
      }
    });

    return commands;
  }

  public executeCommands(message: WAMessage, ...commands: Array<ICommand>) {
    commands.forEach((command) => {
      command.execute(this.client, message);
    });
  }

  public registerCommand(command: ICommand) {
    this.commands.push(command);
  }
}
