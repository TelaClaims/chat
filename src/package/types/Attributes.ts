import { ContactInput } from "./Contact";

export type ConversationAttributes = {
  type: "individual" | "group";
  participants: string[];
};

export type UserAttributes = {
  contact: ContactInput;
};
