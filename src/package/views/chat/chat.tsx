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
  const { fetchMoreMessages } = useChatDispatch();
  const {
    loading,
    conversation,
    messageToInitialScrollTo,
    messagesPaginator,
    messages,
  } = activeConversation || {};

  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({}); // Refs for each message

  // get the last message read by all party participants (use it to know the checkmark status of the message)
  const { lastMessageReadByParticipants } = useLastMessageRead(
    conversation!,
    messages!
  );

  // get the new messages count (use it to show the alert message and display the number of new messages)
  const { newMessagesCount } = useOnUpdateNewMessagesCount(conversation!);

  // scroll to the last message when new messages are added and the last message is in the viewport
  const handleLastMessageInViewPort = (inView: boolean) => {
    if (inView && newMessagesCount > 0) {
      goToLastMessage();
    }
  };

  const TOP_MESSAGE_IN_VIEW_PORT_INDEX = Math.floor(messages!.length / 4);
  const handleTopMessageInViewPort = async (inView: boolean) => {
    if (inView && messagesPaginator?.hasPrevPage) {
      console.log("fetching prev messages");
      goToMessage(messages![TOP_MESSAGE_IN_VIEW_PORT_INDEX], {
        behavior: "auto",
      });
      await fetchMoreMessages("prev");
    }
  };

  const BOTTOM_MESSAGE_IN_VIEW_PORT_INDEX = Math.floor(
    (messages!.length / 4) * 3
  );
  const handleBottomMessageInViewPort = (inView: boolean) => {
    if (inView && messagesPaginator?.hasNextPage) {
      goToMessage(messages![BOTTOM_MESSAGE_IN_VIEW_PORT_INDEX], {
        behavior: "auto",
      });
      fetchMoreMessages("next");
    }
  };

  const { ref: messagesEndRef, inView: lastMessageInViewPort } = useInView({
    onChange: handleLastMessageInViewPort,
  });
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

  const goToLastMessage = () => {
    const messageElement =
      messageRefs.current[messages![messages!.length - 1].sid];
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "auto" });
    }
  };

  // scroll to the last message read by the client only on initial load
  useEffect(() => {
    if (messageToInitialScrollTo) {
      goToMessage(messageToInitialScrollTo, { behavior: "auto", block: "end" });
    }
  }, [messageToInitialScrollTo]);

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

  console.log({ messages, messagesPaginator });

  const showAlertMessage = !lastMessageInViewPort && newMessagesCount > 0;

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
                {index === messages.length - 1 && <span ref={messagesEndRef} />}
                {index === BOTTOM_MESSAGE_IN_VIEW_PORT_INDEX && (
                  <span ref={bottomMessageRef} />
                )}
                <MessageUI
                  message={message}
                  isRead={message.index <= lastMessageReadByParticipants.index}
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
          show={lastMessageInViewPort}
          onClick={goToLastMessage}
        />
        <MessageAlert
          show={showAlertMessage}
          text={`New messages: ${newMessagesCount}`}
          color="info"
          onClickAlert={() =>
            messages &&
            goToMessage(messages[messages.length - 1], { behavior: "smooth" })
          }
        />
        <ChatForm goToLastMessage={goToLastMessage} />
      </Stack.Segment>
    </Stack>
  );
};

export default ChatView;
