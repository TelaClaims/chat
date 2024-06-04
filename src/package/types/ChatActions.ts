import { Message } from "@twilio/conversations";
import { ContactInput } from "./Contact";

export type Handlers = {
  onLookupContact?: (contactToLookup: string) => Promise<ContactInput[]>;
  onClickTag?: (tag: string, message: Message) => void;
};
