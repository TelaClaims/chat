import { useChatDispatch } from "./context/Chat/context";

export const useChat = () => {
  const { goToMessage } = useChatDispatch();

  return {
    goToMessage,
  };
};
