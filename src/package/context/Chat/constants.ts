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
  clearGoingToMessage: () => {},
  setSearch: () => {},
  searchMessages: () => Promise.resolve({} as MessagePagination),
  resetSearchMessages: () => {},
  getContactFromActiveConversation: () => new Contact({ identity: "" }),
};

export const TOTAL_SEARCH_MESSAGES_BY_PAGINATION = 20;
