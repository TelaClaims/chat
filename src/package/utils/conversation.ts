import {
  User,
  Conversation as TwilioConversation,
} from "@twilio/conversations";
import { Contact, ConversationAttributes, UserAttributes } from "../types";

export const getContact = (user: User): Contact => {
  const userAttributes = user.attributes as UserAttributes;
  return Contact.buildContact(userAttributes.contact);
};

export const getConversationType = (conversation: TwilioConversation) => {
  const conversationAttributes =
    conversation.attributes as ConversationAttributes;
  return conversationAttributes.type as "individual" | "group";
};
