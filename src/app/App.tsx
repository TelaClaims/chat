import { styled } from "@mui/material";
import ControlPanel from "./components/ControlPanel";
import { Chat, ContactInput, MessageAttributes } from "@/package";
import { useState } from "react";
import { contactList } from "./contacts.mock";
import { isValidPhoneNumber } from "libphonenumber-js";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Message } from "@twilio/conversations";

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
      }/token?identity=${identity}`
    );
    const { data } = await response.json();
    return data.token;
  };

  const onLookupContact = async (contactToLookup: string) => {
    const results = contactList.filter((contact) =>
      contact.label?.toLowerCase()?.includes(contactToLookup.toLowerCase())
    );

    if (!results.length && isValidPhoneNumber(contactToLookup, "US")) {
      return [
        {
          identity: contactToLookup,
          isNew: true,
        },
      ];
    }

    return results;
  };

  const onClickTag = async (tag: string, message: Message) => {
    if (message.author === contact?.identity) {
      if (tag === "claim") {
        handleCustomContextMenuAction(message);
      }
    }
  };

  const handleCustomContextMenuAction = async (message: Message) => {
    const messageAttributes = message.attributes as MessageAttributes;

    const data = messageAttributes.data;

    if (!data) {
      const response = window.confirm(
        `This message does not have any attributes. Do you want to add some?`
      );

      if (response) {
        await message.updateAttributes({
          data: {
            claims: [
              {
                id: 1,
                name: "claim-1",
                link: "https://example.com/claim-1",
              },
              {
                id: 2,
                name: "claim-2",
                link: "https://example.com/claim-2",
              },
            ],
          },
          tags: ["claim"],
        });
      }

      return;
    }

    const { claims } = data as {
      claims: { id: number; name: string; link: string }[];
    };

    if (claims.length) {
      const response = window.confirm(
        `This message already has attributes:
        ${JSON.stringify(claims, null, 2)}.
        Do you want to update them?`
      );
      if (!response) {
        return;
      }
    }
    await message.updateAttributes({
      data: {
        claims: [
          {
            id: 1,
            name: "claim-1",
            link: "https://example.com/claim-1",
          },
          {
            id: 2,
            name: "claim-2",
            link: "https://example.com/claim-2",
          },
        ],
      },
      tags: ["claim"],
    });
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
          onClickTag,
        }}
        messagesExtendedContextMenu={[
          {
            key: "custom-action",
            label: "Custom Action",
            Icon: <AutoAwesomeIcon fontSize="small" color="inherit" />,
            direction: "outgoing",
            onClick: handleCustomContextMenuAction,
          },
        ]}
      />
    </Layout>
  );
}

export default App;
