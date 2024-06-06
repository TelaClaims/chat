import {
  Message,
  Paginator,
  Participant,
  Conversation as TwilioConversation,
  User,
} from "@twilio/conversations";

export type Conversation = {
  conversation: TwilioConversation;
  participants: Participant[];
  partyParticipants: Participant[];
  partyUsers: User[];
  type: "individual" | "group";
  unreadMessagesCount: number;
};

export interface ActiveConversation extends Conversation {
  loading?: boolean;
  autoScroll?: {
    message: Message;
    scrollOptions?: ScrollIntoViewOptions;
  };
  messages: Message[];
  messagesPaginator?: Paginator<Message>;
}

export type ConversationWithNewMessages = {
  sid: string;
  newMessagesCount: number;
};
