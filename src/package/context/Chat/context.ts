import { createContext, useContext } from "react";
import { InitialState, ChatDispatch } from "./types";
import { INITIAL_STATE, CHAT_DISPATCH } from "./constants";

export const ChatContext = createContext<InitialState>(INITIAL_STATE);

export const ChatDispatchContext = createContext<ChatDispatch>(CHAT_DISPATCH);

export function useChat() {
  return useContext(ChatContext);
}

export function useChatDispatch() {
  return useContext(ChatDispatchContext);
}
