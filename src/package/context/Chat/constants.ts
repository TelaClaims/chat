import { Contact } from "@/package/types";
import { InitialState, ChatDispatch } from "./types";

export const INITIAL_STATE: InitialState = {
  contact: new Contact({ identity: "" }),
  view: "active",
  conversations: [],
};

export const CHAT_DISPATCH: ChatDispatch = {
  initializeChat: () => {},
  setAlert: () => {},
  clearAlert: () => {},
  setView: () => {},
  shutdownChat: () => {},
  selectContact: () => {},
  clearSelectedContact: () => {},
  startConversation: () => Promise.resolve(),
  selectMessage: () => {},
  fetchMoreMessages: () => Promise.resolve(),
};
