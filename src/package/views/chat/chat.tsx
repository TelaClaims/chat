import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { Stack } from "@/package/layouts/Stack";
import { Box, CircularProgress, List, Typography, colors } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
  ChatForm,
  ChatTopBar,
  MessageAlert,
  MessageBackdrop,
  MessageDateLine,
  MessageUI,
} from "@/package/components";
import {
  useOnLastReadMessageByParticipants,
  useOnUpdateNewMessagesCount,
} from "@/package/hooks";
import { Message } from "@twilio/conversations";

const ChatView = () => {
  const { activeConversation, selectedMessage } = useChat();
  const { selectMessage } = useChatDispatch();
  const { loading, conversation, messages } = activeConversation || {};

  const [lastMessageInViewPort, setLastMessageInViewPort] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({}); // Refs for each message

  const { lastMessageIndexReadByParticipants } =
    useOnLastReadMessageByParticipants(conversation!);

  const { newMessagesCount } = useOnUpdateNewMessagesCount(conversation!);

  useEffect(() => {
    if (conversation && messageRefs.current) {
      const lastReadMessageIndex = conversation.lastReadMessageIndex;
      const messagesElements = Object.values(messageRefs.current);

      // Scroll to last read message
      if (lastReadMessageIndex && messagesElements.length) {
        const lastElementToScrollTo = messagesElements.find((element) => {
          const index = element?.getAttribute("data-index");
          return index && parseInt(index) === lastReadMessageIndex;
        });
        if (lastElementToScrollTo) {
          lastElementToScrollTo.scrollIntoView({ behavior: "auto" });
        }
      }
    }
  }, [conversation, messageRefs]);

  useEffect(() => {
    if (!messagesEndRef.current) {
      return;
    }

    const messageEndElement = messagesEndRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!lastMessageInViewPort) {
            setLastMessageInViewPort(true);
          }
        } else {
          if (lastMessageInViewPort) {
            setLastMessageInViewPort(false);
          }
        }
      },
      {
        root: null,
        threshold: 0,
      }
    );

    observer.observe(messageEndElement);

    return () => {
      observer.unobserve(messageEndElement);
    };
  }, [messagesEndRef, messages, lastMessageInViewPort]);

  useEffect(() => {
    if (newMessagesCount > 0 && lastMessageInViewPort) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [lastMessageInViewPort, newMessagesCount]);

  const goToMessage = (message: Message) => {
    const messageElement = messageRefs.current[message.sid];
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const goToLastMessage = () => {
    const messageElement =
      messageRefs.current[messages![messages!.length - 1].sid];
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "auto", block: "center" });
    }
  };

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
                  isRead={message.index <= lastMessageIndexReadByParticipants}
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
            messages && goToMessage(messages[messages.length - 1])
          }
        />
        <ChatForm goToLastMessage={goToLastMessage} />
      </Stack.Segment>
    </Stack>
  );
};

export default ChatView;
