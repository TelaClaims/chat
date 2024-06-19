import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { colors } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState } from "react";
import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { MessageSelectedPlaceHolder } from "../MessageSelectedPlaceHolder/MessageSelectedPlaceHolder";
import { SendMediaButton } from "../SendMediaButton/SendMediaButton";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import { EmojiPickerContainer } from "../EmojiPickerContainer/EmojiPickerContainer";
import { EmojiClickData } from "emoji-picker-react";
import { SelectionChatForm } from "../SelectionChatForm/SelectionChatForm";
import { Handlers } from "@/package/types";

interface Props {
  goToLastMessage: () => void;
  onClickSelectedMessages: Handlers["onClickSelectedMessages"];
}

export const ChatForm = ({
  goToLastMessage,
  onClickSelectedMessages,
}: Props) => {
  const { activeConversation, selectedMessage, selectionMode } = useChat();
  const { selectMessage, setAlert } = useChatDispatch();
  const { conversation } = activeConversation || {};
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const handleTyping = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    } else {
      activeConversation?.conversation.typing();
    }
  };

  const handleSendMessage = async () => {
    const cleanMessage = messageInputRef.current?.value?.trim();
    if (cleanMessage && conversation) {
      hideEmojiPicker();
      if (selectedMessage) {
        const { message, reason } = selectedMessage;
        if (message && reason === "edit") {
          await message.updateBody(cleanMessage);
          selectMessage();
        }
        return;
      }

      // activeConversation?.conversation.sendMessage(cleanMessage);
      await activeConversation?.conversation
        .prepareMessage()
        .setBody(cleanMessage)
        .buildAndSend();
      messageInputRef.current!.value = "";

      await conversation.setAllMessagesRead();
      goToLastMessage();
    }
  };

  const handleSendMediaMessage = async (file: File) => {
    try {
      hideEmojiPicker();
      const fileBlob = await file.arrayBuffer();

      const sendMediaOptions = {
        contentType: file.type,
        filename: file.name,
        media: new Blob([fileBlob]),
      };

      await activeConversation?.conversation
        .prepareMessage()
        .addMedia(sendMediaOptions)
        .buildAndSend();

      await activeConversation?.conversation.setAllMessagesRead();
      goToLastMessage();
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to send media",
      });
    }
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
  };

  const hideEmojiPicker = () => {
    if (isEmojiPickerOpen) {
      setIsEmojiPickerOpen(false);
    }
  };

  const handleOnEmojiClick = (emojiObject: EmojiClickData) => {
    messageInputRef.current!.value += emojiObject.emoji;
  };

  useEffect(() => {
    if (selectedMessage) {
      const { message, reason } = selectedMessage;
      if (reason === "edit") {
        messageInputRef.current!.value = message.body || "";
        messageInputRef.current!.focus();
      }
    } else {
      if (messageInputRef.current) {
        messageInputRef.current.value = "";
      }
    }
  }, [selectedMessage]);

  return (
    <Box
      zIndex={2}
      position={"relative"}
      height={"100%"}
      width={"100%"}
      bgcolor={colors.grey["100"]}
    >
      {selectedMessage && (
        <MessageSelectedPlaceHolder
          message={selectedMessage.message}
          onClose={selectMessage}
        />
      )}

      {selectionMode.active && (
        <SelectionChatForm onClickSelectedMessages={onClickSelectedMessages} />
      )}

      {!selectionMode.active && (
        <>
          <EmojiPickerContainer
            isOpen={isEmojiPickerOpen}
            onEmojiClick={handleOnEmojiClick}
          />
          <Box display={"flex"}>
            <SendMediaButton onSelectedFile={handleSendMediaMessage} />
            <TextField
              sx={{
                zIndex: 2,
                bgcolor: colors.grey["100"],
                pr: 0,
                "& .MuiInputLabel-shrink": {
                  transform: "translate(14px, -3px) scale(0.75)",
                },
              }}
              inputRef={messageInputRef}
              label="Type a message"
              name="message"
              variant="outlined"
              defaultValue={""}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                onKeyDown: handleTyping,
                sx: {
                  pr: 0,
                },
                endAdornment: (
                  <InputAdornment position="end" sx={{ ml: "auto" }}>
                    <Box display={"flex"} alignItems={"center"}>
                      <IconButton
                        color={isEmojiPickerOpen ? "primary" : "default"}
                        onClick={toggleEmojiPicker}
                      >
                        <InsertEmoticonIcon />
                      </IconButton>
                      <Divider
                        orientation="vertical"
                        flexItem
                        variant="middle"
                        sx={{ mx: 1 }}
                      />
                      <IconButton onClick={handleSendMessage}>
                        <SendIcon />
                      </IconButton>
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
};
