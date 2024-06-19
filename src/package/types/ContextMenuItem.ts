import { Message } from "@twilio/conversations";

export type ContextMenuItem = {
  key: string;
  label: string;
  Icon: JSX.Element;
  direction: "incoming" | "outgoing" | "both";
  onClick: (message: Message) => void;
};

export type DefaultContextMenuOptions = "copy" | "edit" | "delete" | "select";
