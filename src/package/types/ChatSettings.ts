import { InitialState } from "../context/Chat/types";
import { ContactInput } from "./Contact";
import { ContextMenuItem } from "./ContextMenuItem";

export type EventContext = {
  view: InitialState["view"];
};

export type Events = {
  onFetchToken: (identity: string, context: EventContext) => Promise<string>;
};

export type ChatSettings = {
  contact: ContactInput;
  events: Events;
  messagesExtendedContextMenu?: ContextMenuItem[];
};

export const defaultChatSettings: ChatSettings = {
  contact: { identity: "" },
  events: {
    onFetchToken: async (identity: string) => {
      return identity;
    },
  },
};
