import { useChat, useChatDispatch } from "@/package/context/Chat/context";
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
import { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import {
  ChatTopBar,
  MessageBackdrop,
  MessageDateLine,
  MessageSelectedPlaceHolder,
  MessageUI,
} from "@/package/components";
import { useOnLastReadMessageByParticipants } from "@/package/hooks";
import { Message } from "@twilio/conversations";

const ChatView = () => {
  const { activeConversation } = useChat();
  const { setAlert } = useChatDispatch();
  const { loading, conversation, messages, partyParticipants } =
    activeConversation || {};
  const [editableMessage, setEditableMessage] = useState<{
    message: Message | null;
  }>({
    message: null,
  });

  const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { lastMessageIndexReadByParticipants } =
    useOnLastReadMessageByParticipants(conversation!);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

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

  const handleSendMessage = async () => {
    const cleanMessage = messageInputRef.current?.value?.trim();
    if (cleanMessage && conversation) {
      if (editableMessage.message) {
        await editableMessage.message.updateBody(cleanMessage);
        handleCloseBackdrop();
        return;
      }

      // activeConversation?.conversation.sendMessage(cleanMessage);
      await activeConversation?.conversation
        .prepareMessage()
        .setBody(cleanMessage)
        .buildAndSend();
      messageInputRef.current!.value = "";

      await conversation.setAllMessagesRead();
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "auto" });
      }
    }
  };

  const handleTyping = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    } else {
      activeConversation?.conversation.typing();
    }
  };

  const handleSelectMessage = (
    message: Message,
    reason: "copy" | "edit" | "delete"
  ) => {
    if (reason === "edit") {
      if (message.body?.trim() === "" || !messageInputRef.current) {
        return;
      }

      messageInputRef.current.value = message.body || "";
      messageInputRef.current?.focus();
      setEditableMessage({ message });
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

  const handleCloseBackdrop = () => {
    if (messageInputRef.current) {
      messageInputRef.current.value = "";
      setEditableMessage({ message: null });
    }
  };

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
        <ChatTopBar
          conversation={conversation!}
          participants={partyParticipants!}
        />
      </Stack.Segment>

      {/* Chat Messages  */}
      <Stack.Segment
        flex={0.8}
        width={"100%"}
        overflow={"auto"}
        display={"flex"}
      >
        {editableMessage.message && (
          <MessageBackdrop onClick={handleCloseBackdrop} />
        )}
        <List sx={{ width: "100%" }}>
          {messages?.map((message, index) => {
            return (
              <Box key={message.sid}>
                <MessageDateLine
                  message={message}
                  beforeMessage={messages?.[index - 1]}
                  isFirstMessage={message.sid === messages[0].sid}
                />
                <MessageUI
                  message={message}
                  isRead={message.index <= lastMessageIndexReadByParticipants}
                  onSelectMessage={handleSelectMessage}
                />
              </Box>
            );
          })}
          {messages?.length === 0 && (
            <Box display={"flex"} justifyContent={"center"} p={2}>
              <Typography variant={"body1"}>No messages yet.</Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Stack.Segment>

      {/* Chat Input Tools */}
      <Stack.Segment flex={0.1} bgcolor={colors.grey["100"]} zIndex={10}>
        {editableMessage.message && (
          <MessageSelectedPlaceHolder
            message={editableMessage.message}
            onClose={handleCloseBackdrop}
          />
        )}
        <TextField
          inputRef={messageInputRef}
          label="Type a message"
          name="message"
          variant="outlined"
          defaultValue={""}
          fullWidth
          InputLabelProps={{ shrink: true }}
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
