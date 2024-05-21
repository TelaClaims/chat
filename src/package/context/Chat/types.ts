import { ChatSettings, Contact, ContactInput } from "@/package/types";
import {
  Client,
  Conversation,
  Message,
  Paginator,
  Participant,
  User,
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
  conversations: Conversation[];
  activeConversation?: {
    loading: boolean;
    conversation: Conversation;
    messages: Message[];
    partyParticipants: Participant[];
    partyUsers: User[];
    messagesUnreadCount: number | null;
    messageToInitialScrollTo?: Message;
    messagesPaginator?: Paginator<Message>;
  };
  selectedMessage?: {
    message: Message;
    reason: "copy" | "edit" | "delete";
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
    | "selectMessage";
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
    reason?: "copy" | "edit" | "delete"
  ) => void;
  fetchMoreMessages: (direction: "prev" | "next") => Promise<void>;
};
