import {
  ActiveConversation,
  ChatSettings,
  Contact,
  ContactInput,
  ContextMenuItem,
  Conversation,
  DefaultContextMenuOptions,
  MessagePagination,
} from "@/package/types";
import {
  Client,
  Message,
  Paginator,
  Conversation as TwilioConversation,
} from "@twilio/conversations";

export type Views = "inactive" | "active" | "lookup" | "contact" | "on-chat";

export type InitialState = {
  view: Views;
  contact: Contact;
  contactSelected?: Contact;
  client?: Client;
  alert?: {
    message: string;
    context?: string;
    severity?: "critical" | "regular";
    type: "error" | "warning" | "info" | "success";
  };
  conversations?: Conversation[];
  activeConversation?: ActiveConversation;
  selectedMessage?: {
    message: Message;
    reason: "copy" | "edit" | "delete";
  };
  messagesExtendedContextMenu?: ContextMenuItem[];
  goingToMessage?: {
    index: number;
    isGoing: boolean;
  };
  search: {
    active?: boolean;
    query?: string;
    results?: MessagePagination;
    isSearching?: boolean;
  };
  selectionMode: {
    active?: boolean;
    selectedMessages: Message[];
  };
};

export type ChatAction = {
  type:
    | "setAlert"
    | "setView"
    | "setContact"
    | "setClient"
    | "setConversations"
    | "selectContact"
    | "setActiveConversation"
    | "updateParticipantTyping"
    | "selectMessage"
    | "setMessagesExtendedContextMenu"
    | "setGoingToMessage"
    | "setSearch"
    | "setConversationsWithNewMessages"
    | "setSelectionMode";
  payload: Partial<InitialState>;
};

export type ChatDispatch = {
  initializeChat: (chatSettings: ChatSettings) => void;
  setAlert: (alert: InitialState["alert"]) => void;
  clearAlert: () => void;
  setView: (view: InitialState["view"]) => void;
  shutdownChat: () => void;
  selectContact: (contact: ContactInput, view?: Views) => void;
  clearSelectedContact: () => void;
  startConversation: (contact: Contact) => Promise<void>;
  selectMessage: (
    message?: Message,
    reason?: DefaultContextMenuOptions
  ) => void;
  fetchMoreMessages: (
    anchorMessageIndex: number
  ) => Promise<Paginator<Message> | undefined>;
  setAutoScroll: (
    message: Message,
    scrollOptions?: ScrollIntoViewOptions
  ) => void;
  clearMessageToInitialScrollTo: () => void;
  goToMessage: (index: number) => void;
  clearGoingToMessage: () => void;
  getContext: () => InitialState;
  setSearch: (searchState: InitialState["search"]) => void;
  searchMessages: ({
    query,
    lastMessageIndex,
  }: {
    query: string;
    lastMessageIndex?: number;
  }) => Promise<MessagePagination>;
  resetSearchMessages: () => void;
  getContactFromActiveConversation: (identity: string) => Contact;
  setSelectionMode: (selectionModeState: InitialState["selectionMode"]) => void;
  resetSelectionMode: () => void;
  deleteSelectedMessages: () => Promise<number | undefined>;
  getBulkMessages: (
    conversation: TwilioConversation,
    indexFrom: number,
    indexTo: number
  ) => Promise<Message[]>;
};
