import {
  OrderDetails,
  Product,
  CatalogCollection,
  ProductCreate,
  ProductUpdate,
  proto,
  BaileysEventMap,
  BinaryNode,
  WAPatchCreate,
  WAPresence,
  WAMediaUpload,
  WABusinessProfile,
  WAPatchName,
  AppStateChunk,
  ChatModification,
  MessageRelayOptions,
  MessageReceiptType,
  MediaConnInfo,
  WAMediaUploadFunction,
  AnyMessageContent,
  MiscMessageGenerationOptions,
  GroupMetadata,
  ParticipantAction,
  BaileysEventEmitter,
  AuthenticationCreds,
  SignalKeyStoreWithTransaction,
  Contact,
  ConnectionState,
  WASocket,
} from "@adiwajshing/baileys";
import {ICommand} from "./core/command";

export default class TestCommand implements ICommand {
  command: string = "test";
  async execute(client: WASocket, message: proto.IWebMessageInfo) {
    console.log(message.key.participant);
  }
}
