import { Message } from "@twilio/conversations";
import { ContactInput } from "./Contact";

export type Handlers = {
  onClickTag?: (tag: string, message: Message) => void;
  onLookupContact?: (contactToLookup: string) => Promise<ContactInput[]>;
  onRenderContact?: (contact: ContactInput) => React.ReactNode | undefined;
};
