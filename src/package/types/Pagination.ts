import { Message } from "@twilio/conversations";

export type MessagePagination = {
  items: Message[];
  hasMore: boolean;
};
