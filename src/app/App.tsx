import { styled } from "@mui/material";
import ControlPanel from "./components/ControlPanel";
import { Chat, ContactInput } from "@/package";
import { useState } from "react";
import { contactList } from "./contacts.mock";

const Layout = styled("div")`
  display: flex;
  align-items: center;
  height: 100vh;
  justify-content: space-evenly;
`;

function App() {
  const [contact, setContact] = useState<ContactInput>();

  const handleSetContact = (contact: ContactInput | undefined) => {
    if (!contact) {
      return setContact(undefined);
    }
    setContact(contact);
  };

  const onFetchToken = async (identity: string) => {
    const response = await fetch(
      `${
        import.meta.env.CHAT_TWILIO_FUNCTIONS_DOMAIN
      }/chat/token?identity=${identity}`
    );
    const { data } = await response.json();
    return data.token;
  };

  const onLookupContact = async (contactToLookup: string) => {
    const results = contactList.filter((contact) =>
      contact.label?.toLowerCase()?.includes(contactToLookup.toLowerCase())
    );

    return results;
  };

  return (
    <Layout>
      <ControlPanel
        contactList={contactList}
        contact={contact}
        handleSetContact={handleSetContact}
      />
      <Chat
        contact={contact || { identity: "" }}
        events={{
          onFetchToken,
        }}
        handlers={{
          onLookupContact,
        }}
      />
    </Layout>
  );
}

export default App;
