import { useChat } from "@/package/context/Chat/context";
import { Stack } from "@/package/layouts/Stack";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  List,
  TextField,
  Typography,
  colors,
} from "@mui/material";
import { useEffect, useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import { ChatTopBar, MessageUI } from "@/package/components";
import { useOnLastReadMessage } from "@/package/hooks";

const ChatView = () => {
  const { activeConversation } = useChat();
  const { loading, conversation, messages, partyParticipants } =
    activeConversation || {};

  const { lastMessageIndexReadByParticipants } = useOnLastReadMessage(
    conversation!
  );

  const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    const cleanMessage = messageInputRef.current?.value?.trim();
    if (cleanMessage && conversation) {
      // activeConversation?.conversation.sendMessage(cleanMessage);
      await activeConversation?.conversation
        .prepareMessage()
        .setBody(cleanMessage)
        .buildAndSend();
      messageInputRef.current!.value = "";

      await conversation.setAllMessagesRead();
    }
  };

  const handleTyping = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    } else {
      activeConversation?.conversation.typing();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  if (loading)
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

  return (
    <Stack>
      {/* Chat Top Bar */}
      <Stack.Segment
        flex={0.1}
        display={"flex"}
        width={"100%"}
        bgcolor={colors.grey["200"]}
      >
        <ChatTopBar
          conversation={conversation!}
          participants={partyParticipants!}
        />
      </Stack.Segment>

      {/* Chat Messages  */}
      <Stack.Segment
        flex={0.8}
        display={"flex"}
        width={"100%"}
        overflow={"auto"}
      >
        <List sx={{ width: "100%" }}>
          {messages?.map((message) => (
            <MessageUI
              key={message.sid}
              message={message}
              isRead={message.index <= lastMessageIndexReadByParticipants}
            />
          ))}
          {messages?.length === 0 && (
            <Box display={"flex"} justifyContent={"center"} p={2}>
              <Typography variant={"body1"}>No messages yet.</Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Stack.Segment>

      {/* Chat Input Tools */}
      <Stack.Segment flex={0.1} pt={1} bgcolor={colors.grey["100"]}>
        <TextField
          inputRef={messageInputRef}
          label="Type a message"
          name="message"
          variant="outlined"
          defaultValue={""}
          fullWidth
          InputProps={{
            onKeyDown: handleTyping,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSendMessage}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack.Segment>
    </Stack>
  );
};

export default ChatView;
