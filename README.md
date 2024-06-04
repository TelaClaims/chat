# Chat Component

The `Chat` component enables users to exchange messages in real-time. It serves as a straightforward yet essential element for any application needing a chat functionality. The component supports message sending, receiving, and displaying in a conversational format. Key features include user authentication, message timestamps, and typing indicators. It is easily customizable to match the look and feel of your application. A live demo and additional documentation can be found [here](https://telaclaims.github.io/chat)

## Features

- **Real-time messaging**: Users can send and receive messages in real-time.
- **Status, typing and readability indicators**: Users can see the status of the contact, typing indicators, and read receipts.
- **Message timestamps**: Messages display the time they were sent.
- **Image attachments**: Users can send images.
- **Search and navigation messages**: Users can search for messages in the chat history and navigate to the message.

## Installation

```bash
npm install @telaclaims-tech/softphone
```

## Requirements and Dependencies

- [Node.js v16.16.0](https://nodejs.org/en/download/) - Required for running JavaScript applications.
- [React v17.0.2](https://www.npmjs.com/package/react) - Required for building user interfaces.
- [MUI Material v5.15.15](https://www.npmjs.com/package/@mui/material) - Provides Material Design UI components.
- [Twilio Conversations SDK v2.5.0](https://www.npmjs.com/package/@twilio/conversations) - Create meaningful connections with customers across various communication channels.
- [libphonenumber-js v1.10.60](https://www.npmjs.com/package/libphonenumber-js) - A library for parsing, formatting, and validating international phone numbers.
- [react-intersection-observer v9.10.2](https://www.npmjs.com/package/react-intersection-observer) - A React component that adds the Intersection Observer API to the React. For infinite scrolling handler.

## Usage

Below is a basic example of how to use the `Chat` component:

First need to use the ChatProvider to wrap the Chat component.

```jsx
import { ChatProvider } from "@telaclaims-tech/chat";

function App() {
  return (
    <ChatProvider>
      <Chat />
    </ChatProvider>
  );
}
```

Then, you can use the `Chat` component and related `hooks` in your application:

```jsx
import Chat from "@telaclaims-tech/chat";

function App() {
  const onFetchToken = async (identity) => {
    // Fetch and return a Twilio token for the given identity.
  };

  return <Chat contact={{ identity: "test" }} events={{ onFetchToken }} />;
}
```

## Types

### `ContactInput`

This type represents the input structure required for contact-related operations in the Softphone component.

```typescript
type ContactInput = ContactConstructorArgs | Contact;
```

### `ContactConstructorArgs`

This type represents the constructor arguments for creating a new contact.

```typescript
type ContactConstructorArgs = {
  identity: string;
  id?: string;
  label?: string;
  isNew?: boolean;
  status?: ContactStatus;
  avatar?: string;
  type?: "phone" | "identifier";
  data?: Record<string, unknown>;
};
```

**Properties:**

- **`identity`** _`required`_: The unique identifier for the contact used to communicate with Twilio and associated to the token.

- **`id`** _`(default: uuidv4)`_: Other unique identifier for the contact.

- **`label`** _`(default: identity)`_: The display name for the contact.

- **`isNew`** _`(default: false)`_: Indicates if the contact is new. display a New Icon in the contact list.

- **`status`** _`("available" | "unavailable" | "unknown"(default))`_: The status of the Chat client.

- **`avatar`** _`(default: "/")`_: The URL of the contact's avatar.

- **`type`** _`("phone" | "identifier"(default))`_: The type of contact. phone if the identity is a valid Phone Number. identifier otherwise.

- **`data`** _`({})`_: Additional data for the contact.

### `Contact`

This is a base class for the contact object. It represents a contact in the Chat component. Exported to use.

```typescript
const contact = new Contact(...ContactConstructorArgs);
```

or

```typescript
const contact = Contact.buildContact(...ContactInput);
```

### `ChatSettings`

This type represents the settings for the Chat component.

```typescript
type ChatSettings = {
  contact: ContactInput;
  events: Events;
  messagesExtendedContextMenu?: ContextMenuItem[];
};
```

**Properties:**

- **`contact`** _`required`_: The registered contact.

- **`events`** _`required`_: The event handlers for the Chat component. See the `Events` type for more details.

- **`messagesExtendedContextMenu`** _`(optional)`_: The extended context menu items for the messages.

### `ContextMenuItem`

This type represents the context menu items for the Chat component.

```typescript
type ContextMenuItem = {
  key: string;
  label: string;
  Icon: JSX.Element;
  direction: "incoming" | "outgoing" | "both";
  onClick: (message: Message) => void;
};
```

**Properties:**

- **`key`** _`required`_: The unique key for the context menu item.
- **`label`** _`required`_: The label for the context menu item.
- **`Icon`** _`required`_: The icon for the context menu item.
- **`direction`** _`required`_: The direction of the message to display the context menu item. incoming, outgoing, or both.
- **`onClick`** _`required`_: The click event handler for the context menu item.

### `Events`

This type represents the event handlers for the Chat component. They are dispatched when specific events occur within the component.

```typescript
type Events = {
  onFetchToken: (identity: string, context: EventContext) => Promise<string>;
};
```

**Properties:**

- **`onFetchToken`** _`required`_: Fetches the Twilio token for the given identity.

### `Handlers`

This type represents the handlers for the Chat component.

```typescript
type Handlers = {
  onLookupContact?: (contactToLookup: string) => Promise<ContactInput[]>;
  onClickTag?: (tag: string, message: Message) => void;
};
```

**Properties:**

- **`onLookupContact`** _`(optional)`_: Looks up a contact by the given identity. This function is called when the user type for a contact in the search contact input. Provide the input typed by the user and return the contacts that match the input.

- **`onClickTag`** _`(optional)`_: Handles the click event on a tag in the message. This function is called when the user clicks on a tag in the message. Provide the tag clicked and the message where the tag is located.

### `Note`

The main difference between `Events` and `Handlers` is that `Events` are dispatched when specific events occur within the internal state between `Chat` and `Twilio SDK` events. These events do not have access to the current state of the component. To access the current state of the component, the context object provided in the `Events` should be used. On the other hand, `Handlers` are functions that are called when the user interacts with the component, and they do have access to the current state of the component.

## Chat Props

The `Chat` component accepts the following props:

- **`contact`** _`ContactInput`_: The contact to register with the Chat component.

- **`events`** _`Events`_: The event handlers for the Chat component.

- **`handlers`** _`Handlers`_: The handlers for the Chat component.

- **`messagesExtendedContextMenu`** _`ContextMenuItem[]`_: The extended context menu items for the messages.

## Hooks

### `useChat`

The `useChat` hook provides access to the Chat component's state and methods. It can be used to interact with the Chat component programmatically.

```jsx
import { useChat } from "@telaclaims-tech/chat";

function App() {
  const { goToMessage, startConversation } = useChat();

  return (
    // ...
  );
}
```

**Properties:**

- **`goToMessage`** _`function`_: Scrolls to the message with the given index. (Every message has an index starting from 0)

- **`startConversation`** _`function`_: Starts a new or existing conversation with the given contact.
