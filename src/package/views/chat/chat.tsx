import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { Stack } from "@/package/layouts/Stack";
import { Box, CircularProgress, List, Typography, colors } from "@mui/material";
import { useEffect, useRef } from "react";
import {
  ChatForm,
  ChatTopBar,
  MessageAlert,
  MessageAlertScrollToBottom,
  MessageBackdrop,
  MessageDateLine,
  MessageUI,
} from "@/package/components";
import {
  useLastMessageRead,
  useOnUpdateNewMessagesCount,
} from "@/package/hooks";
import { Message } from "@twilio/conversations";
import { useInView } from "react-intersection-observer";

const ChatView = () => {
  const { activeConversation } = useChat();
  const { fetchMoreMessages, clearMessageToInitialScrollTo, getContext } =
    useChatDispatch();
  const { loading, conversation, autoScroll, messagesPaginator, messages } =
    activeConversation || {};

  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({}); // Refs for each message

  // get the last message read by all party participants (use it to know the checkmark status of the message)
  const { lastMessageReadByParticipants } = useLastMessageRead(
    conversation!,
    messages!
  );

  // get the new messages count (use it to show the alert message and display the number of new messages)
  const { newMessagesCount } = useOnUpdateNewMessagesCount(conversation!);

  const TOP_MESSAGE_IN_VIEW_PORT_INDEX = Math.floor(messages!.length * 0.1);
  const handleTopMessageInViewPort = async (inView: boolean) => {
    if (inView && messagesPaginator?.hasPrevPage) {
      const topMessageInViewPort = messages![TOP_MESSAGE_IN_VIEW_PORT_INDEX];
      await fetchMoreMessages(topMessageInViewPort.index);
      goToMessage(topMessageInViewPort, {
        behavior: "auto",
        block: "nearest",
      });
    }
  };

  const BOTTOM_MESSAGE_IN_VIEW_PORT_INDEX = Math.floor(messages!.length * 0.9);
  const handleBottomMessageInViewPort = async (inView: boolean) => {
    if (inView && messagesPaginator?.hasNextPage) {
      const bottomMessageInViewPort =
        messages![BOTTOM_MESSAGE_IN_VIEW_PORT_INDEX - 1];
      await fetchMoreMessages(bottomMessageInViewPort.index);
      goToMessage(bottomMessageInViewPort, {
        behavior: "auto",
        block: "end",
        inline: "end",
      });
    }
  };

  const { ref: messagesEndRef, inView: messagesEndInViewPort } = useInView();
  const { ref: topMessageRef } = useInView({
    onChange: handleTopMessageInViewPort,
  });
  const { ref: bottomMessageRef } = useInView({
    onChange: handleBottomMessageInViewPort,
  });

  const goToMessage = (
    message: Message,
    scrollIntoViewOptions?: ScrollIntoViewOptions
  ) => {
    const messageElement = messageRefs.current[message.sid];
    if (messageElement) {
      messageElement.scrollIntoView(scrollIntoViewOptions);
    }
  };

  const goToLastMessage = async () => {
    const { activeConversation } = getContext();
    const { conversation, messages, messagesPaginator } = activeConversation!;

    if (messagesPaginator?.hasNextPage) {
      const lastMessageIndex = conversation.lastMessage?.index;
      if (lastMessageIndex) {
        const paginator = await fetchMoreMessages(lastMessageIndex);
        const lastMessage = paginator?.items[paginator.items.length - 1];
        if (lastMessage) {
          goToMessage(lastMessage, {
            behavior: "auto",
            block: "end",
          });
        }
      }
    } else {
      const lastMessage = messages![messages!.length - 1];
      if (lastMessage) {
        goToMessage(lastMessage, {
          behavior: "smooth",
          block: "end",
        });
      }
    }
  };

  const goToLastReadMessage = async () => {
    const { conversation } = activeConversation!;
    const lastReadMessageIndex = conversation.lastReadMessageIndex;

    if (messagesPaginator?.hasNextPage) {
      if (lastReadMessageIndex) {
        const paginator = await fetchMoreMessages(lastReadMessageIndex);
        const lastReadMessage = paginator?.items.find(
          (message) => message.index === lastReadMessageIndex
        );
        if (lastReadMessage) {
          goToMessage(lastReadMessage, {
            behavior: "auto",
            block: "end",
          });
        }
      }
    } else {
      const lastReadMessage = messages?.find(
        (message) => message.index === lastReadMessageIndex
      );
      if (lastReadMessage) {
        goToMessage(lastReadMessage, {
          behavior: "smooth",
          block: "end",
        });
      }
    }
  };

  // scroll to the message when the autoScroll message is set and clear the autoScroll after scrolling
  useEffect(() => {
    if (autoScroll?.message) {
      const { message, scrollOptions } = autoScroll;
      goToMessage(message, scrollOptions);
      clearMessageToInitialScrollTo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoScroll?.message]);

  // scroll to the last message when new messages are added and the last message is in the viewport
  useEffect(() => {
    if (messagesEndInViewPort && newMessagesCount > 0) {
      goToLastMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesEndInViewPort, newMessagesCount]);

  if (loading) {
    return (
      <Box
        display={"flex"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <CircularProgress color="primary" size={60} />
      </Box>
    );
  }

  const showAlertMessage = !messagesEndInViewPort && newMessagesCount > 0;

  return (
    <Stack>
      {/* Chat Top Bar */}
      <Stack.Segment
        flex={0.1}
        display={"flex"}
        width={"100%"}
        bgcolor={colors.grey["200"]}
        zIndex={10}
      >
        <ChatTopBar />
      </Stack.Segment>

      {/* Chat Messages  */}
      <Stack.Segment
        flex={0.8}
        width={"100%"}
        overflow={"auto"}
        display={"flex"}
        height={"100%"}
      >
        <MessageBackdrop />
        {messages?.length ? (
          <List sx={{ width: "100%" }}>
            {messages?.map((message, index) => (
              <Box
                key={message.sid}
                ref={(ref) =>
                  (messageRefs.current[message.sid] = ref as HTMLDivElement)
                }
                data-index={message.index}
              >
                <MessageDateLine
                  message={message}
                  beforeMessage={messages?.[index - 1]}
                  isFirstMessage={message.sid === messages[0].sid}
                />
                {index === TOP_MESSAGE_IN_VIEW_PORT_INDEX && (
                  <span ref={topMessageRef} />
                )}
                {index === BOTTOM_MESSAGE_IN_VIEW_PORT_INDEX && (
                  <span ref={bottomMessageRef} />
                )}
                {index === messages.length - 1 && <span ref={messagesEndRef} />}
                <MessageUI
                  message={message}
                  isRead={
                    lastMessageReadByParticipants.index !== -1 &&
                    lastMessageReadByParticipants.index >= message.index
                  }
                />
              </Box>
            ))}
          </List>
        ) : (
          <Box
            width={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            p={2}
          >
            <Typography
              variant={"body1"}
              color={"text.secondary"}
              sx={{ fontStyle: "italic" }}
            >
              No messages yet.
            </Typography>
          </Box>
        )}
      </Stack.Segment>

      {/* Chat Input Tools */}
      <Stack.Segment flex={0.1} bgcolor={colors.grey["100"]} zIndex={1}>
        <MessageAlertScrollToBottom
          show={!messagesEndInViewPort}
          onClick={goToLastMessage}
        />
        <MessageAlert
          show={showAlertMessage}
          text={`New messages: ${newMessagesCount}`}
          color="info"
          onClickAlert={goToLastReadMessage}
        />
        <ChatForm goToLastMessage={goToLastMessage} />
      </Stack.Segment>
    </Stack>
  );
};

export default ChatView;
