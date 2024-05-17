import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { Stack } from "@/package/layouts/Stack";
import { Box, CircularProgress, List, Typography, colors } from "@mui/material";
import { useEffect, useRef } from "react";
import {
  ChatForm,
  ChatTopBar,
  MessageAlert,
  MessageBackdrop,
  MessageDateLine,
  MessageUI,
} from "@/package/components";
import {
  useElementInViewPort,
  useLastMessageRead,
  useOnUpdateNewMessagesCount,
} from "@/package/hooks";
import { Message } from "@twilio/conversations";

const ChatView = () => {
  const { activeConversation, selectedMessage } = useChat();
  const { selectMessage } = useChatDispatch();
  const { loading, conversation, messages } = activeConversation || {};

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({}); // Refs for each message

  // get the last message read by all party participants (use it to know the checkmark status of the message)
  const { lastMessageReadByParticipants, lastMessageReadByClient } =
    useLastMessageRead(conversation!, messages!);

  // get the new messages count (use it to show the alert message and display the number of new messages)
  const { newMessagesCount } = useOnUpdateNewMessagesCount(conversation!);

  // get if the last message is in the viewport
  const { isInViewPort: lastMessageInViewPort } = useElementInViewPort(
    messagesEndRef.current
  );

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

  // scroll to the last message read by the client
  useEffect(() => {
    if (lastMessageReadByClient?.message) {
      goToMessage(lastMessageReadByClient.message, {
        behavior: "auto",
        block: "end",
      });
    }
  }, [lastMessageReadByClient?.message]);

  // scroll to the last message when new messages are added and the last message is in the viewport
  useEffect(() => {
    if (newMessagesCount > 0 && lastMessageInViewPort) {
      goToLastMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessageInViewPort, newMessagesCount]);

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
        {selectedMessage && <MessageBackdrop onClick={selectMessage} />}
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
                {index === messages.length - 1 && <div ref={messagesEndRef} />}
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
