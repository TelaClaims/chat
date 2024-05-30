import { ActiveView, ChatView, ContactView, LookupView } from "../views";
import Layout from "./Layout";
import { useChat } from "../context/Chat/context";
import { Handlers } from "../types";

interface Props {
  handlers?: Handlers;
}

export const Main = ({ handlers }: Props) => {
  const { view } = useChat();

  const { onLookupContact, onClickTag } = handlers || {};

  return (
    <>
      <Layout.View>
        {view === "active" && <ActiveView />}
        {view === "lookup" && <LookupView onLookupContact={onLookupContact} />}
        {view === "contact" && <ContactView />}
        {view === "on-chat" && <ChatView onClickTag={onClickTag} />}
      </Layout.View>
    </>
  );
};
