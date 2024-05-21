import { useCallback, useReducer, useRef } from "react";
import { ChatContext, ChatDispatchContext } from "./context";
import { INITIAL_STATE } from "./constants";
import { InitialState, ChatAction, Views } from "./types";
import {
  Client,
  ConversationBindings,
  JSONValue,
  Message,
  Paginator,
  Participant,
  ParticipantType,
  User,
} from "@twilio/conversations";
import {
  ChatSettings,
  Contact,
  ContactInput,
  ConversationAttributes,
  UserAttributes,
  defaultChatSettings,
} from "@/package/types";
import { log } from "@/package/utils";
import { SideBarProvider } from "../SideBarPanel/SideBarProvider";

function chatReducer(state: InitialState, action: ChatAction): InitialState {
  switch (action.type) {
    case "setAlert": {
      return {
        ...state,
        alert: action.payload.alert,
      };
    }
    case "setView": {
      return {
        ...state,
        view: action.payload.view as InitialState["view"],
      };
    }
    case "setContact": {
      return {
        ...state,
        contact: action.payload.contact as InitialState["contact"],
      };
    }
    case "setClient": {
      return {
        ...state,
        client: action.payload.client as InitialState["client"],
      };
    }
    case "setConversations": {
      return {
        ...state,
        conversations: action.payload
          .conversations as InitialState["conversations"],
      };
    }
    case "selectContact": {
      return {
        ...state,
        contactSelected: action.payload
          .contactSelected as InitialState["contactSelected"],
      };
    }
    case "setActiveConversation": {
      return {
        ...state,
        activeConversation: action.payload
          .activeConversation as InitialState["activeConversation"],
      };
    }
    case "selectMessage": {
      return {
        ...state,
        selectedMessage: action.payload
          .selectedMessage as InitialState["selectedMessage"],
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chat, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  // To keep the state ref updated inside the callbacks of the chat events
  const chatRef = useRef<InitialState>(chat);
  chatRef.current = chat;

  const getEventContext = () => {
    return {
      view: chatRef.current.view,
    };
  };

  const initializeChat = async (
    chatSettings: ChatSettings = defaultChatSettings
  ) => {
    const { contact, events } = chatSettings;

    setAlert({
      type: "info",
      message: "Initializing chat...",
    });

    const token = await events.onFetchToken(
      contact.identity,
      getEventContext()
    );

    setContact(contact);

    const client = new Client(token);

    addClientListeners(client, events);

    dispatch({ type: "setView", payload: { view: "active" } });
    dispatch({ type: "setClient", payload: { client } });
  };

  const addClientListeners = (
    client: Client,
    events: ChatSettings["events"]
  ) => {
    //#region Initialization
    client.on("initialized", () => {
      console.log("Client initialized successfully");

      const userAttributes: UserAttributes = {
        contact: chatRef.current.contact.toJSON(),
      };

      client.user.updateAttributes(userAttributes as JSONValue);
      clearAlert();
    });

    client.on("initFailed", ({ error }) => {
      setAlert({
        type: "error",
        message: "Failed to initialize chat",
        context: error?.message,
        severity: "critical",
      });
    });
    //#endregion

    //#region Connection State
    client.on("connectionStateChanged", (state) => {
      if (state === "connecting") {
        log("log", "Connecting to chat");
      }

      if (state === "connected") {
        log("log", "Connected to chat");
      }

      if (state === "disconnecting") {
        log("log", "Disconnecting from chat");
      }

      if (state === "disconnected") {
        log("log", "Disconnected from chat");
      }

      if (state === "denied") {
        log("log", "Connection denied");
      }

      if (state === "error") {
        log("log", "Error connecting to chat");
      }

      if (state === "unknown") {
        log("log", "Unknown connection state");
      }
    });

    client.on("connectionError", (error) => {
      log("error", "Connection error", { error });
    });
    //#endregion

    //#region Conversation Events
    client.on("conversationJoined", (conversation) => {
      log("log", "Conversation joined", { conversation });
      // dispatch({
      //   type: "setConversations",
      //   payload: {
      //     conversations: [...chatRef.current.conversations, conversation],
      //   },
      // });
    });

    client.on("conversationLeft", (conversation) => {
      log("log", "Conversation left", { conversation });
      dispatch({
        type: "setConversations",
        payload: {
          conversations: [
            ...chat.conversations.filter((c) => c !== conversation),
          ],
        },
      });
    });

    client.on("conversationAdded", (conversation) => {
      log("log", "Conversation added", { conversation });
    });

    client.on("conversationRemoved", (conversation) => {
      log("log", "Conversation removed", { conversation });
    });

    client.on("conversationUpdated", ({ conversation, updateReasons }) => {
      log("log", "Conversation updated", { conversation, updateReasons });
    });
    //#endregion

    //#region Message Events
    client.on("messageAdded", (message) => {
      log("log", "Message added", { message });

      if (
        chatRef.current.activeConversation?.conversation.sid ===
        message.conversation.sid
      ) {
        dispatch({
          type: "setActiveConversation",
          payload: {
            activeConversation: {
              ...chatRef.current.activeConversation,
              messages: [
                ...chatRef.current.activeConversation.messages,
                message,
              ],
            },
          },
        });
      }
    });

    client.on("messageRemoved", (message) => {
      log("log", "Message removed", { message });

      if (
        chatRef.current.activeConversation?.conversation.sid ===
        message.conversation.sid
      ) {
        dispatch({
          type: "setActiveConversation",
          payload: {
            activeConversation: {
              ...chatRef.current.activeConversation,
              messages: [
                ...chatRef.current.activeConversation.messages.filter(
                  (m) => m.sid !== message.sid
                ),
              ],
            },
          },
        });
      }
    });

    client.on("messageUpdated", (message) => {
      log("log", "Message updated", { message });
    });
    //#endregion

    //#region Participant Events
    client.on("participantJoined", (participant) => {
      log("log", "Participant joined", { participant });
    });

    client.on("participantLeft", (participant) => {
      log("log", "Participant left", { participant });
    });

    client.on("participantUpdated", (participant) => {
      log("log", "Participant updated", { participant });
    });
    //#endregion

    //#region Token Events
    client.on("tokenAboutToExpire", async () => {
      log("log", "Token about to expire");
      try {
        const token = await events.onFetchToken(
          client.user?.identity || chatRef.current.contact.identity,
          getEventContext()
        );
        client = await client.updateToken(token);

        dispatch({ type: "setClient", payload: { client } });
        addClientListeners(client, events);
      } catch (error) {
        setAlert({
          type: "error",
          message: "Token about to expire, unable to get a token",
          context: JSON.stringify(error),
          severity: "critical",
        });
      }
    });

    client.on("tokenExpired", async () => {
      log("log", "Token expired");
      try {
        const token = await events.onFetchToken(
          client.user?.identity || chatRef.current.contact.identity,
          getEventContext()
        );
        client = new Client(token);
        dispatch({ type: "setClient", payload: { client } });
        addClientListeners(client, events);
      } catch (error) {
        setAlert({
          type: "error",
          message: "Token expired, unable to get a token",
          context: JSON.stringify(error),
          severity: "critical",
        });
      }
    });
    //#endregion

    //#region Typing Events
    client.on("typingStarted", (participant) => {
      log("log", "Typing started", { participant });
      // updateParticipantTyping(participant);
    });

    client.on("typingEnded", (participant) => {
      log("log", "Typing ended", { participant });
      // updateParticipantTyping(participant);
    });
    //#endregion

    //#region User Events
    client.on("userSubscribed", async (user) => {
      log("log", "User subscribed", { user });
    });

    client.on("userUnsubscribed", (user) => {
      log("log", "User unsubscribed", { user });
    });

    client.on("userUpdated", ({ user, updateReasons }) => {
      log("log", "User updated", { user });
      if (updateReasons.includes("reachabilityOnline")) {
        log("log", "User is online", { user });
      }

      if (updateReasons.includes("reachabilityNotifiable")) {
        log("log", "User is notifiable", { user });
      }
    });
    //#endregion

    client.on("pushNotification", (notification) => {
      log("log", "Push notification", { notification });
    });

    client.on("stateChanged", (state) => {
      if (state === "initialized") {
        log("log", "Client initialized", { state });
      }

      if (state === "failed") {
        log("log", "Client failed", { state });
      }
    });
  };

  const setAlert = useCallback((alert: InitialState["alert"]) => {
    dispatch({ type: "setAlert", payload: { alert } });
  }, []);

  const clearAlert = useCallback(() => {
    dispatch({ type: "setAlert", payload: { alert: undefined } });
  }, []);

  const setView = useCallback((view: InitialState["view"]) => {
    dispatch({ type: "setView", payload: { view } });
  }, []);

  const setContact = (contact: ContactInput) => {
    dispatch({
      type: "setContact",
      payload: { contact: Contact.buildContact(contact) },
    });
  };

  const shutdownChat = async () => {
    await chat.client?.shutdown();
    dispatch({ type: "setClient", payload: { client: undefined } });
  };

  const selectContact = async (contactSelected: ContactInput, view?: Views) => {
    const { contact, client } = chatRef.current;

    if (!contact?.identity || client?.connectionState !== "connected") {
      setAlert({
        message: "The Chat is not ready",
        severity: "critical",
        type: "error",
        context:
          "lookupContact failed. Identity is missing or client.state is not connected.",
      });
      return;
    }

    if (contactSelected.identity === contact.identity) {
      setAlert({
        message: "You are registered as this contact.",
        type: "error",
        context: "selectContact failed. Cannot select yourself.",
      });
      return;
    }

    dispatch({
      type: "selectContact",
      payload: { contactSelected: Contact.buildContact(contactSelected) },
    });

    if (view === "on-chat") {
      const conversation = findConversationByIdentity(contactSelected.identity);
      if (conversation) {
        await selectConversation(conversation?.sid);
      }
    }
    dispatch({ type: "setView", payload: { view: view || "contact" } });
  };

  const clearSelectedContact = () => {
    dispatch({
      type: "selectContact",
      payload: { contactSelected: undefined },
    });
  };

  const startConversation = async (contact: Contact) => {
    const { client } = chatRef.current;

    if (!client) {
      setAlert({
        message: "The Chat is not ready",
        severity: "critical",
        type: "error",
        context: "startConversation failed. Client is missing.",
      });
      return;
    }

    try {
      if (contact.type === "identifier") {
        await client.getUser(contact.identity);
      } else {
        setAlert({
          message: "Start conversation with SMS not implemented yet",
          type: "warning",
        });
        return;
      }

      const conversations = (await client.getSubscribedConversations()).items;

      const existingConversation = conversations.find((conversation) => {
        const conversationAttributes =
          conversation.attributes as ConversationAttributes;

        return (
          conversationAttributes.type === "individual" &&
          conversationAttributes.participants.includes(contact.identity)
        );
      });

      if (existingConversation) {
        await selectConversation(existingConversation.sid);
        dispatch({ type: "setView", payload: { view: "on-chat" } });
        return;
      }

      const conversation = await client.createConversation({
        friendlyName: `${chat.contact.identity} - ${contact.identity}`,
        uniqueName: `${chat.contact.identity} - ${contact.identity}`,
        attributes: {
          type: "individual",
          participants: [chat.contact.identity, contact.identity],
        } as ConversationAttributes,
      });

      if (contact.type === "identifier") {
        await conversation.add(contact.identity);
      } else {
        // TODO: Implement SMS conversation
        // const TWILIO_PHONE_NUMBER = "+19793303975";
        // const BINDING_ADDRESS = "+17726465796";
        // await conversation.addNonChatParticipant(
        //   TWILIO_PHONE_NUMBER,
        //   BINDING_ADDRESS,
        //   { identity: contact.identity }
        // );
      }
      await conversation.join();
      await selectConversation(conversation.sid);
      dispatch({ type: "setView", payload: { view: "on-chat" } });
    } catch (error) {
      setAlert({
        message: "Failed to start conversation",
        type: "error",
        context: JSON.stringify(error),
      });
    }
  };

  const findConversationByIdentity = (identity: string) => {
    return chat.conversations.find((conversation) =>
      Array.from(conversation._participants.values()).some((participant) => {
        const participantType = participant.type as ParticipantType;
        const participantBindings =
          participant.bindings as ConversationBindings;

        if (participantType === "sms") {
          return participantBindings.sms?.address === identity;
        }
        if (participantType === "chat") {
          return participant.identity === identity;
        }
      })
    );
  };

  // const getParticipants = async (conversation: Conversation) => {
  //   return await conversation.getParticipants();
  // };

  // const getConversations = async () => {
  //   if (!chat?.client) {
  //     throw new Error("Client is not initialized");
  //   }

  //   const conversationsPaginator: Paginator<Conversation> =
  //     await chat.client.getSubscribedConversations();

  //   const conversations: Conversation[] = conversationsPaginator.items;

  //   return conversations;
  // };

  const selectConversation = async (conversationSid: string) => {
    const { client } = chatRef.current;
    if (!client) {
      throw new Error("Client is not initialized");
    }

    const conversation = await client.getConversationBySid(conversationSid);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    let messagesPaginator: Paginator<Message>;
    let messages: Message[] = [];
    let participants: Participant[] = [];
    let partyParticipants: Participant[] = [];
    let partyUsers: User[] = [];
    let messagesUnreadCount: number | null = null;
    let messageToInitialScrollTo: Message | undefined;

    dispatch({
      type: "setActiveConversation",
      payload: {
        activeConversation: {
          ...chatRef.current.activeConversation!,
          loading: true,
        },
      },
    });

    const totalToFetch = 10;
    const lastMessageReadByClientIndex = conversation.lastReadMessageIndex || 0;
    const unreadMessagesCount = await conversation.getUnreadMessagesCount();

    if (unreadMessagesCount === 0) {
      messagesPaginator = await conversation.getMessages(totalToFetch);
      messages = messagesPaginator.items;
      messageToInitialScrollTo = messages[messages.length - 1];
    } else {
      const anchor =
        lastMessageReadByClientIndex + Math.floor(totalToFetch / 2);
      messagesPaginator = await conversation.getMessages(totalToFetch, anchor);
      messages = messagesPaginator.items;
      messageToInitialScrollTo = messages.find(
        (message) => message.index === lastMessageReadByClientIndex
      );
      messages;
    }

    participants = await conversation.getParticipants();
    partyParticipants = participants.filter(
      (participant) => participant.identity !== chat.contact.identity
    );
    partyUsers = await Promise.all(
      partyParticipants.map(async (participant) => {
        return await participant.getUser();
      })
    );
    messagesUnreadCount = await conversation.getUnreadMessagesCount();

    dispatch({
      type: "setActiveConversation",
      payload: {
        activeConversation: {
          loading: false,
          conversation,
          messages,
          partyParticipants,
          partyUsers,
          messagesUnreadCount,
          messageToInitialScrollTo,
          messagesPaginator,
        },
      },
    });
  };

  const fetchMoreMessages = async (direction: "prev" | "next") => {
    const { activeConversation } = chatRef.current;
    if (!activeConversation) {
      return;
    }

    const { messagesPaginator } = activeConversation;
    if (!messagesPaginator) {
      return;
    }

    let newMessagesPaginator: Paginator<Message>;

    if (direction === "prev") {
      // newMessagesPaginator = await messagesPaginator.prevPage();
      newMessagesPaginator = await activeConversation.conversation.getMessages(
        activeConversation.messages.length + 10,
        // activeConversation.messages[0].index - 1
      );
      const messages = newMessagesPaginator.items;

      dispatch({
        type: "setActiveConversation",
        payload: {
          activeConversation: {
            ...activeConversation,
            messagesPaginator: newMessagesPaginator,
            messages: [...messages],
          },
        },
      });
    }

    if (direction === "next") {
      newMessagesPaginator = await messagesPaginator.nextPage();
      const messages = newMessagesPaginator.items;

      dispatch({
        type: "setActiveConversation",
        payload: {
          activeConversation: {
            ...activeConversation,
            messagesPaginator: newMessagesPaginator,
            messages: [...messages],
          },
        },
      });
    }
  };

  const selectMessage = (
    message?: Message,
    reason?: "copy" | "edit" | "delete"
  ) => {
    if (!reason || !message) {
      dispatch({
        type: "selectMessage",
        payload: {
          selectedMessage: undefined,
        },
      });
      return;
    }
    if (reason === "edit") {
      if (message.body?.trim() === "") {
        return;
      }

      // messageInputRef.current.value = message.body || "";
      // messageInputRef.current?.focus();
      dispatch({
        type: "selectMessage",
        payload: {
          selectedMessage: {
            message,
            reason: "edit",
          },
        },
      });
    }
    if (reason === "delete") {
      message.remove();
      setAlert({
        message: "Message deleted",
        type: "info",
      });
    }
    if (reason === "copy") {
      navigator.clipboard.writeText(message.body || "");
      setAlert({
        message: "Message copied to clipboard",
        type: "info",
      });
    }
  };

  return (
    <SideBarProvider>
      <ChatContext.Provider value={chat}>
        <ChatDispatchContext.Provider
          value={{
            initializeChat,
            setAlert,
            clearAlert,
            setView,
            shutdownChat,
            selectContact,
            clearSelectedContact,
            startConversation,
            selectMessage,
            fetchMoreMessages,
          }}
        >
          {children}
        </ChatDispatchContext.Provider>
      </ChatContext.Provider>
    </SideBarProvider>
  );
};

export default ChatProvider;
