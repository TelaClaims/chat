import { useChatDispatch, useChat as _useChat } from "./context/Chat/context";
import { Contact, ContactInput } from "./types";

export const useChat = () => {
  // const [conversationsWithNewMessages, setConversationsWithNewMessages] =
  //   useState<{ sid: string; newMessages: number }[]>([]);
  const { client, conversations } = _useChat();

  const { goToMessage, startConversation } = useChatDispatch();

  const openConversationWith = async (contact: ContactInput) => {
    if (!client) {
      throw new Error("Chat client is not initialized.");
    }

    startConversation(Contact.buildContact(contact));
  };

  // useEffect(() => {
  //   const getNewMessagesCount = (conversation: Conversation) => {
  //     const {
  //       lastMessage: lastConversationMessage,
  //       lastReadMessageIndex: lastMessageReadByUserIndex,
  //     } = conversation || {};

  //     const newMessagesCount =
  //       lastConversationMessage?.index !== undefined &&
  //       lastMessageReadByUserIndex !== null
  //         ? lastConversationMessage.index - lastMessageReadByUserIndex
  //         : 0;

  //     return newMessagesCount;
  //   };

  //   client?.on(
  //     "conversationUpdated",
  //     async ({ conversation, updateReasons }) => {
  //       if (
  //         updateReasons.includes("lastMessage") ||
  //         updateReasons.includes("lastReadMessageIndex")
  //       ) {
  //         const newMessagesCount = await getNewMessagesCount(conversation);
  //         const conversationsWithNewMessages = conversations?.map(
  //           ({ conversation }) => {
  //             if (conversation.sid === conversation.sid) {
  //               return { sid: conversation.sid, newMessages: newMessagesCount };
  //             }
  //             return conversation;
  //           }
  //         );

  //         setConversationsWithNewMessages(conversationsWithNewMessages || []);
  //       }
  //     }
  //   );

  //   const conversationsWithNewMessages = conversations?.map(
  //     ({ conversation, unreadMessagesCount }) => {
  //       return { sid: conversation.sid, newMessages: unreadMessagesCount };
  //     }
  //   );

  //   setConversationsWithNewMessages(conversationsWithNewMessages || []);

  //   return () => {};
  // }, [client, conversations]);

  // console.log({
  //   conversationsWithNewMessages,
  // });

  conversations?.forEach((conversation) => {
    if (conversation.unreadMessagesCount > 0) {
      console.log(
        `Conversation ${conversation.conversation.sid}} has ${conversation.unreadMessagesCount} unread messages.`
      );
    }
  });

  return {
    goToMessage,
    openConversationWith,
  };
};
