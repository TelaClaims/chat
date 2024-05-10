import { ContactInput } from "./Contact";

export type Handlers = {
  onLookupContact?: (contactToLookup: string) => Promise<ContactInput[]>;
  onClickMakeCallButton?: (contact: ContactInput) => void;
  onRenderContact?: (contact: ContactInput) => React.ReactNode | undefined;
  onRenderIncomingView?: (contact: ContactInput) => React.ReactNode | undefined;
};
