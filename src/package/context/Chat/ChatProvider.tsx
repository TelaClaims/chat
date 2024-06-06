import { useCallback, useReducer, useRef } from "react";
import { ChatContext, ChatDispatchContext } from "./context";
import {
  INITIAL_STATE,
  TOTAL_SEARCH_MESSAGES_BY_PAGINATION,
} from "./constants";
import { InitialState, ChatAction, Views } from "./types";
import {
  Client,
  Conversation as TwilioConversation,
  JSONValue,
  Message,
  Paginator,
  UserUpdateReason,
  User,
} from "@twilio/conversations";
import {
  ActiveConversation,
  ChatSettings,
  Contact,
  ContactInput,
  ContextMenuItem,
  Conversation,
  ConversationAttributes,
  MessageAttributes,
  MessagePagination,
  UserAttributes,
  defaultChatSettings,
} from "@/package/types";
import { getConversationType, log } from "@/package/utils";
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
    case "setMessagesExtendedContextMenu": {
      return {
        ...state,
        messagesExtendedContextMenu: action.payload
          .messagesExtendedContextMenu as InitialState["messagesExtendedContextMenu"],
      };
    }
    case "setGoingToMessage": {
      return {
        ...state,
        goingToMessage: action.payload
          .goingToMessage as InitialState["goingToMessage"],
      };
    }
    case "setSearch": {
      return {
        ...state,
        search: action.payload.search as InitialState["search"],
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

  //#region dispatchers
  const initializeChat = async (
    chatSettings: ChatSettings = defaultChatSettings
  ) => {
    const { contact, events, messagesExtendedContextMenu } = chatSettings;

    setAlert({
      type: "info",
      message: "Initializing chat...",
    });

    const token = await events.onFetchToken(
      contact.identity,
      getEventContext()
    );

    setContact(contact);
    if (messagesExtendedContextMenu) {
      setMessagesExtendedContextMenu(messagesExtendedContextMenu);
    }

    const client = new Client(token);

    addClientListeners(client, events);

    dispatch({ type: "setView", payload: { view: "active" } });
    dispatch({ type: "setClient", payload: { client } });
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

  const setMessagesExtendedContextMenu = (
    messagesExtendedContextMenu: ContextMenuItem[]
  ) => {
    dispatch({
      type: "setMessagesExtendedContextMenu",
      payload: { messagesExtendedContextMenu },
    });
  };

  const shutdownChat = async () => {
    try {
      if (chatRef.current.client) {
        await chatRef.current.client.shutdown();
        clearSelectedContact();
        dispatch({ type: "setConversations", payload: { conversations: [] } });
      }
    } catch (error) {
      setAlert({
        message: "Failed to shutdown chat",
        type: "error",
        context: JSON.stringify(error),
      });
    }
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
        await selectConversation(conversation.sid);
      }
    }
    dispatch({ type: "setView", payload: { view: view || "contact" } });
  };

  const clearSelectedContact = () => {
    dispatch({
      type: "setActiveConversation",
      payload: {
        activeConversation: undefined,
      },
    });

    dispatch({
      type: "selectContact",
      payload: { contactSelected: undefined },
    });
  };

  const startConversation = async (contact: Contact) => {
    const client = getClient();

    try {
      if (contact.type === "identifier") {
        try {
          await client.getUser(contact.identity);
        } catch (error) {
          throw new Error("User not exist in the conversation service");
        }
      } else {
        setAlert({
          message: "Start conversation with SMS not implemented yet",
          type: "warning",
        });
        return;
      }

      // ! Only work for individual conversations with Users not SMS
      const existingConversation = chat.conversations?.find(
        ({ type, partyUsers }) => {
          return (
            type === "individual" &&
            partyUsers.some((user) => user.identity === contact.identity)
          );
        }
      );

      if (existingConversation) {
        await selectConversation(existingConversation.conversation.sid);
        dispatch({ type: "setView", payload: { view: "on-chat" } });
        return;
      }

      const conversation = await client.createConversation({
        friendlyName: `${chat.contact.identity} - ${contact.identity}`,
        uniqueName: `${chat.contact.identity} - ${contact.identity}`,
        attributes: {
          type: "individual",
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

  const fetchMoreMessages = async (anchorMessageIndex: number) => {
    const { activeConversation } = chatRef.current;
    if (!activeConversation) {
      return;
    }
    const newMessagesPaginator = await getMessagePaginator(
      activeConversation.conversation,
      anchorMessageIndex
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

    return newMessagesPaginator;
  };

  const setAutoScroll = (
    message: Message,
    scrollOptions?: ScrollIntoViewOptions
  ) => {
    dispatch({
      type: "setActiveConversation",
      payload: {
        activeConversation: {
          ...chatRef.current.activeConversation!,
          autoScroll: {
            message,
            scrollOptions,
          },
        },
      },
    });
  };

  const clearMessageToInitialScrollTo = () => {
    dispatch({
      type: "setActiveConversation",
      payload: {
        activeConversation: {
          ...chatRef.current.activeConversation!,
          autoScroll: undefined,
        },
      },
    });
  };

  const getContext = () => {
    return {
      ...chatRef.current,
    };
  };

  const goToMessage = async (messageIndex: number) => {
    try {
      let message: Message | undefined;

      const { activeConversation } = chatRef.current;

      if (!activeConversation) {
        setAlert({
          message: "No active conversation",
          type: "warning",
        });
        return;
      }

      const { conversation } = activeConversation;
      const lastMessageIndex = conversation.lastMessage?.index || 0;

      if (messageIndex < 0 || messageIndex > lastMessageIndex) {
        setAlert({
          message: "Message not found",
          type: "warning",
        });
        return;
      }

      dispatch({
        type: "setGoingToMessage",
        payload: {
          goingToMessage: {
            index: messageIndex,
            isGoing: true,
          },
        },
      });

      const messagePaginator = await fetchMoreMessages(messageIndex);
      if (messagePaginator) {
        message = messagePaginator.items.find((m) => m.index === messageIndex);

        if (message) {
          setTimeout(() => {
            setAutoScroll(message!, {
              behavior: "auto",
              block: "center",
            });
            dispatch({
              type: "setGoingToMessage",
              payload: {
                goingToMessage: {
                  index: messageIndex,
                  isGoing: false,
                },
              },
            });
          }, 1000);
        } else {
          setAlert({
            message: "Message not found",
            type: "warning",
          });
        }
      }
    } catch (error) {
      throw new Error("Failed to go to message");
    }
  };

  const setSearch = (searchState: InitialState["search"]) => {
    const currentSearch = chatRef.current.search;
    dispatch({
      type: "setSearch",
      payload: { search: { ...currentSearch, ...searchState } },
    });
  };

  const resetSearchMessages = () => {
    setSearch({
      active: false,
      query: "",
      results: {
        items: [],
        hasMore: false,
      },
      isSearching: false,
    });
  };
  //#endregion

  //#region utils functions
  const addClientListeners = (
    client: Client,
    events: ChatSettings["events"]
  ) => {
    //#region Initialization
    client.on("initialized", async () => {
      log("log", "Client initialized successfully");

      const userAttributes: UserAttributes = {
        contact: chatRef.current.contact.toJSON(),
      };

      client.user.updateAttributes(userAttributes as JSONValue);

      const conversations = await fetchConversations();

      dispatch({
        type: "setConversations",
        payload: {
          conversations,
        },
      });

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
    });

    client.on("conversationLeft", (conversation) => {
      log("log", "Conversation left", { conversation });
    });

    client.on("conversationAdded", (conversation) => {
      log("log", "Conversation added", { conversation });
    });

    client.on("conversationRemoved", (conversation) => {
      log("log", "Conversation removed", { conversation });
    });

    client.on(
      "conversationUpdated",
      async ({ conversation, updateReasons }) => {
        log("log", "Conversation updated", { conversation, updateReasons });

        if (updateReasons.includes("lastReadMessageIndex")) {
          const {
            lastMessage: lastConversationMessage,
            lastReadMessageIndex: lastMessageReadByUserIndex,
          } = conversation || {};

          const newMessagesCount =
            lastConversationMessage?.index !== undefined &&
            lastMessageReadByUserIndex !== null
              ? lastConversationMessage.index - lastMessageReadByUserIndex
              : 0;

          dispatch({
            type: "setActiveConversation",
            payload: {
              activeConversation: {
                ...chatRef.current.activeConversation!,
                unreadMessagesCount: newMessagesCount,
              },
            },
          });

          const { conversations = [] } = chatRef.current;
          const updatedConversations = conversations.map((c) => {
            if (c.conversation.sid === conversation.sid) {
              return {
                ...c,
                unreadMessagesCount: newMessagesCount,
              };
            }
            return c;
          });

          dispatch({
            type: "setConversations",
            payload: {
              conversations: updatedConversations,
            },
          });
        }
      }
    );

    //#endregion

    //#region Message Events
    client.on("messageAdded", async (message) => {
      log("log", "Message added", { message });

      const { activeConversation, conversations = [] } = chatRef.current;
      const { conversation: conversationMessage } = message;

      // update the active conversation
      if (activeConversation?.conversation.sid === conversationMessage.sid) {
        const { messagesPaginator } = activeConversation || {};

        const updatedActiveConversation = {
          ...activeConversation,
        };

        // Add message only if the paginator is in the last page
        if (!messagesPaginator?.hasNextPage) {
          updatedActiveConversation.messages = [
            ...activeConversation.messages,
            message,
          ];
        }

        // update unreadMessagesCount on ActiveConversation only if the message is not from the current user
        if (message.author !== client?.user.identity) {
          updatedActiveConversation.unreadMessagesCount += 1;
        }

        dispatch({
          type: "setActiveConversation",
          payload: {
            activeConversation: updatedActiveConversation,
          },
        });
      }

      // update the conversations list
      // put message conversation at the top of the list of conversations
      const updatedConversations = await putUpdatedConversationAtTop(
        conversationMessage,
        conversations
      );

      // update unreadMessagesCount on conversation
      if (message.author !== client?.user.identity) {
        for (const conversation of updatedConversations) {
          if (conversation.conversation.sid === conversationMessage.sid) {
            conversation.unreadMessagesCount += 1;
            break;
          }
        }
      }

      dispatch({
        type: "setConversations",
        payload: {
          conversations: updatedConversations,
        },
      });
    });

    client.on("messageRemoved", (message) => {
      log("log", "Message removed", { message });
      const { activeConversation } = chatRef.current;

      if (activeConversation?.conversation.sid === message.conversation.sid) {
        dispatch({
          type: "setActiveConversation",
          payload: {
            activeConversation: {
              ...activeConversation,
              messages: [
                ...activeConversation.messages.filter(
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
    // client.on("participantJoined", (participant) => {
    //   log("log", "Participant joined", { participant });
    // });

    // client.on("participantLeft", (participant) => {
    //   log("log", "Participant left", { participant });
    // });

    // client.on("participantUpdated", (participant) => {
    //   log("log", "Participant updated", { participant });
    // });
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

    client.on(
      "userUpdated",
      async ({
        user,
        updateReasons,
      }: {
        user: User;
        updateReasons: UserUpdateReason[];
      }) => {
        log("log", "User updated", { user });
        if (updateReasons.includes("reachabilityOnline")) {
          log("log", "User reachabilityOnline", { user });

          const { conversations = [] } = chatRef.current;

          const updatedConversations = conversations.map((conversation) => {
            const updatedPartyUsers = conversation.partyUsers.map((partyUser) =>
              partyUser.identity === user.identity ? user : partyUser
            );

            return {
              ...conversation,
              partyUsers: updatedPartyUsers,
            };
          });
          dispatch({
            type: "setConversations",
            payload: {
              conversations: updatedConversations as Conversation[],
            },
          });
        }

        if (updateReasons.includes("reachabilityNotifiable")) {
          log("log", "User is notifiable", { user });
        }
      }
    );
    //#endregion

    client.on("pushNotification", (notification) => {
      log("log", "Push notification", { notification });
    });

    client.on("stateChanged", async (state) => {
      if (state === "initialized") {
        log("log", "Client initialized", { state });
      }

      if (state === "failed") {
        log("log", "Client failed", { state });
      }
    });
  };

  const findConversationByIdentity = (identity: string) => {
    if (!chat.conversations) {
      return;
    }

    const conversation = chat.conversations.find(
      ({ type, partyUsers }) =>
        type === "individual" &&
        partyUsers.some((user) => user.identity === identity)
    );

    return conversation?.conversation;
  };

  const selectConversation = async (conversationSid: string) => {
    dispatch({
      type: "setActiveConversation",
      payload: {
        activeConversation: {
          ...chatRef.current.activeConversation!,
          loading: true,
        },
      },
    });

    const {
      conversation,
      messages,
      participants,
      partyParticipants,
      partyUsers,
      autoScroll,
      messagesPaginator,
      type,
      unreadMessagesCount,
    } = await fetchActiveConversation(conversationSid);

    dispatch({
      type: "setActiveConversation",
      payload: {
        activeConversation: {
          loading: false,
          conversation,
          messages,
          participants,
          partyParticipants,
          partyUsers,
          autoScroll,
          messagesPaginator,
          type,
          unreadMessagesCount,
        },
      },
    });

    resetSearchMessages();
  };

  const fetchConversations = async () => {
    const client = getClient();
    let conversations: Conversation[] = [];

    try {
      let conversationsPaginator = await client.getSubscribedConversations();

      while (conversationsPaginator.items.length) {
        const pageConversations = await Promise.all(
          conversationsPaginator.items.map(async (conversation) => {
            return await fetchConversation(conversation);
          })
        );
        conversations = conversations.concat(pageConversations);

        if (conversationsPaginator.hasNextPage) {
          conversationsPaginator = await conversationsPaginator.nextPage();
        } else {
          break; // No more pages to fetch
        }
      }

      conversations = sortConversations(conversations);

      return conversations;
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to fetch conversations",
        context: JSON.stringify(error),
      });
      return [];
    }
  };

  const fetchConversation = async (
    conversation: TwilioConversation
  ): Promise<Conversation> => {
    const participants = await conversation.getParticipants();
    const partyParticipants = participants.filter(
      (participant) => participant.identity !== chatRef.current.contact.identity
    );
    const partyUsers = await Promise.all(
      partyParticipants.map(async (participant) => {
        return await participant.getUser();
      })
    );
    const unreadMessagesCount =
      (await conversation.getUnreadMessagesCount()) || 0;

    return {
      conversation,
      participants,
      partyParticipants,
      partyUsers,
      type: getConversationType(conversation),
      unreadMessagesCount,
    };
  };

  const sortConversations = (conversations: Conversation[]) => {
    return conversations.sort((a, b) => {
      return (
        (b.conversation.lastMessage?.dateCreated?.getTime() || 0) -
        (a.conversation.lastMessage?.dateCreated?.getTime() || 0)
      );
    });
  };

  const putUpdatedConversationAtTop = async (
    updatedConversation: TwilioConversation,
    conversations: Conversation[]
  ): Promise<Conversation[]> => {
    const updatedConversations = [...conversations];

    const conversationUpdatedIndex = updatedConversations.findIndex(
      (c) => c.conversation.sid === updatedConversation.sid
    );

    if (conversationUpdatedIndex !== -1) {
      const [conversationUpdated] = updatedConversations.splice(
        conversationUpdatedIndex,
        1
      );
      updatedConversations.unshift(conversationUpdated);
    } else {
      // Fetch and add new conversation to the top
      try {
        const newConversation = await fetchConversation(updatedConversation);
        updatedConversations.unshift(newConversation);
      } catch (error) {
        setAlert({
          type: "error",
          message: "Failed to fetch updated conversation",
          context: JSON.stringify(error),
        });
      }
    }

    return updatedConversations;
  };

  const fetchActiveConversation = async (
    conversationSid: string
  ): Promise<ActiveConversation> => {
    const client = getClient();
    const conversation = await client.getConversationBySid(conversationSid);

    client.getSubscribedConversations();

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const {
      participants,
      partyParticipants,
      partyUsers,
      type,
      unreadMessagesCount,
    } = await fetchConversation(conversation);

    let messagesPaginator: Paginator<Message>;
    let messages: Message[] = [];
    let autoScroll: {
      message: Message;
      scrollOptions?: ScrollIntoViewOptions;
    };

    if (unreadMessagesCount === 0) {
      messagesPaginator = await getMessagePaginator(conversation);
      messages = messagesPaginator.items;
      autoScroll = {
        message: messages[messages.length - 1],
        scrollOptions: {
          behavior: "auto",
          block: "end",
        },
      };
    } else {
      const lastMessageReadByClientIndex =
        conversation.lastReadMessageIndex || 0;
      messagesPaginator = await getMessagePaginator(
        conversation,
        lastMessageReadByClientIndex
      );
      messages = messagesPaginator.items;
      autoScroll = {
        message:
          messages.find(
            (message) => message.index === lastMessageReadByClientIndex
          ) || messages[messages.length - 1],
        scrollOptions: {
          behavior: "auto",
          block: "end",
        },
      };
    }

    return {
      conversation,
      messages,
      participants,
      partyParticipants,
      partyUsers,
      autoScroll,
      messagesPaginator,
      type,
      unreadMessagesCount,
    };
  };

  const getMessagePaginator = async (
    conversation: TwilioConversation,
    indexToFetch?: number,
    totalToFetch: number = 100
  ) => {
    let messagesPaginator: Paginator<Message>;
    const lastMessageIndex = conversation.lastMessage?.index || 0;
    indexToFetch = indexToFetch ?? lastMessageIndex;

    const anchor = indexToFetch + Math.floor(totalToFetch / 2);

    if (anchor > lastMessageIndex) {
      messagesPaginator = await conversation.getMessages(totalToFetch);
    } else {
      messagesPaginator = await conversation.getMessages(totalToFetch, anchor);
    }

    return messagesPaginator;
  };

  const getClient = (): Client => {
    const { client } = chatRef.current;

    if (!client) {
      setAlert({
        message: "The Chat is not ready",
        severity: "critical",
        type: "error",
        context: "startConversation failed. Client is missing.",
      });
      throw new Error("Client is missing");
    }

    return client;
  };

  const getEventContext = () => {
    return {
      view: chatRef.current.view,
    };
  };

  const searchMessages = async ({
    query,
    lastMessageIndex,
  }: {
    query: string;
    lastMessageIndex?: number;
  }): Promise<MessagePagination> => {
    const { activeConversation } = chatRef.current;
    if (!activeConversation) {
      setAlert({
        message: "No active conversation",
        type: "warning",
      });
      return {
        items: [],
        hasMore: false,
      };
    }

    const { conversation } = activeConversation;

    const messagesPagination = await getMessagesFilteredByQuery(
      query,
      conversation,
      lastMessageIndex
    );

    return messagesPagination;
  };

  const getMessagesFilteredByQuery = async (
    query: string,
    conversation: TwilioConversation,
    lastMessageFoundIndex?: number
  ) => {
    const result: MessagePagination = {
      items: [],
      hasMore: false,
    };

    let messagesPaginator = await conversation.getMessages(
      100,
      lastMessageFoundIndex ? lastMessageFoundIndex - 1 : undefined
    );

    while (messagesPaginator.items.length) {
      const messages = messagesPaginator.items.sort((a, b) => {
        return b.index - a.index;
      });

      for (const message of messages) {
        const messageAttribute = message.attributes as MessageAttributes;

        // Filter criteria
        if (
          message.body?.toLowerCase().includes(query.toLowerCase()) ||
          messageAttribute.tags?.includes(query.toLowerCase())
        ) {
          if (result.items.length === TOTAL_SEARCH_MESSAGES_BY_PAGINATION) {
            result.hasMore = true;
            break;
          }
          result.items.push(message);
        }
      }

      if (
        result.items.length === TOTAL_SEARCH_MESSAGES_BY_PAGINATION ||
        !messagesPaginator.hasPrevPage
      ) {
        break;
      }

      messagesPaginator = await messagesPaginator.prevPage();
    }

    return result;
  };

  //#endregion

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
            setAutoScroll,
            clearMessageToInitialScrollTo,
            goToMessage,
            getContext,
            setSearch,
            searchMessages,
            resetSearchMessages,
          }}
        >
          {children}
        </ChatDispatchContext.Provider>
      </ChatContext.Provider>
    </SideBarProvider>
  );
};

export default ChatProvider;
