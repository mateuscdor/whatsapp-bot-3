import {
    proto,
    WASocket,
  } from "@adiwajshing/baileys";
  import {ICommand} from "../core/command";
  
  export default class CloseGCCommand extends ICommand {
    command: string = "closegc";
    async execute(client: WASocket, message: proto.IWebMessageInfo) {
    }
  }
  