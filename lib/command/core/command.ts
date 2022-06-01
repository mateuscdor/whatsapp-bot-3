import {
  AnyMessageContent,
  AppStateChunk,
  AuthenticationCreds,
  BaileysEventEmitter,
  BaileysEventMap,
  BinaryNode,
  CatalogCollection,
  ChatModification,
  ConnectionState,
  Contact,
  GroupMetadata,
  MediaConnInfo,
  MessageReceiptType,
  MessageRelayOptions,
  MiscMessageGenerationOptions,
  OrderDetails,
  ParticipantAction,
  Product,
  ProductCreate,
  ProductUpdate,
  proto,
  SignalKeyStoreWithTransaction,
  WABusinessProfile,
  WAMediaUpload,
  WAMediaUploadFunction,
  WAMessage,
  WAPatchCreate,
  WAPatchName,
  WAPresence,
  WASocket,
} from "@adiwajshing/baileys";

export interface ICommand {
  command: string;
  execute(client: WASocket, message: WAMessage): void;
}

export class Command implements ICommand {
  command: string;
  executor: (client: WASocket, message: proto.IWebMessageInfo) => void;

  constructor(
    command: string,
    executor: (client: WASocket, message: proto.IWebMessageInfo) => void
  ) {
    this.command = command;
    this.executor = executor;
  }

  execute(client: WASocket, message: proto.IWebMessageInfo): void {
    return this.executor(client, message);
  }
}
