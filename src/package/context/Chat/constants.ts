import { MessagePagination } from "./../../types/Pagination";
import { Contact } from "@/package/types";
import { InitialState, ChatDispatch } from "./types";

export const INITIAL_STATE: InitialState = {
  contact: new Contact({ identity: "" }),
  view: "active",
  conversations: [],
  search: {
    active: false,
    query: "",
    results: {
      items: [],
      hasMore: false,
    },
  },
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
  fetchMoreMessages: () => Promise.resolve(undefined),
  setAutoScroll: () => {},
  getContext: () => INITIAL_STATE,
  clearMessageToInitialScrollTo: () => {},
  goToMessage: () => {},
  setSearch: () => {},
  searchMessages: () => Promise.resolve({} as MessagePagination),
  resetSearchMessages: () => {},
};
