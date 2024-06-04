import { useChatDispatch, useChat as _useChat } from "./context/Chat/context";
import { Contact, ContactInput } from "./types";

export const useChat = () => {
  const { client } = _useChat();

  const { goToMessage, startConversation } = useChatDispatch();

  const openConversationWith = async (contact: ContactInput) => {
    if (!client) {
      throw new Error("Chat client is not initialized.");
    }

    startConversation(Contact.buildContact(contact));
  };

  return {
    goToMessage,
    openConversationWith,
  };
};
