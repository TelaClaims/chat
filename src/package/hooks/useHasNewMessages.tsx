import { useMemo } from "react";
import { useChat } from "../context/Chat/context";

export const useHasNewMessages = () => {
  const { conversations } = useChat();

  const countConversationsWithNewMessages = useMemo(() => {
    if (!conversations) return 0;
    return conversations.filter(
      ({ unreadMessagesCount }) => unreadMessagesCount > 0
    ).length;
  }, [conversations]);

  const hasNewMessage = countConversationsWithNewMessages > 0;

  return { hasNewMessage, countConversationsWithNewMessages };
};
