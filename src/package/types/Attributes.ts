import { ContactInput } from "./Contact";

export type ConversationAttributes = {
  type: "individual" | "group";
};

export type UserAttributes = {
  contact: ContactInput;
};
