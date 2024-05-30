import { Message } from "@twilio/conversations";
import { ContactInput } from "./Contact";

export type Handlers = {
  onClickTag?: (tag: string, message: Message) => void;
  onLookupContact?: (contactToLookup: string) => Promise<ContactInput[]>;
  onClickMakeCallButton?: (contact: ContactInput) => void;
  onRenderContact?: (contact: ContactInput) => React.ReactNode | undefined;
  onRenderIncomingView?: (contact: ContactInput) => React.ReactNode | undefined;
};
