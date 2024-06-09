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
import EmojiPicker from "emoji-picker-react";

interface Props {
  goToLastMessage: () => void;
}

export const ChatForm = ({ goToLastMessage }: Props) => {
  const { activeConversation, selectedMessage } = useChat();
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

  const hideEmojiPicker = () => {
    if (isEmojiPickerOpen) {
      setIsEmojiPickerOpen(false);
    }
  };

  useEffect(() => {
    if (selectedMessage) {
      const { message, reason } = selectedMessage;
      if (reason === "edit") {
        messageInputRef.current!.value = message.body || "";
        messageInputRef.current!.focus();
      }
    } else {
      messageInputRef.current!.value = "";
    }
  }, [selectedMessage]);

  return (
    <>
      {selectedMessage && (
        <MessageSelectedPlaceHolder
          message={selectedMessage.message}
          onClose={selectMessage}
        />
      )}
      <Box
        sx={{
          position: "absolute",
          bottom: 55,
          right: 0,
          left: 0,
          maxHeight: isEmojiPickerOpen ? "370px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.2s ease",
          "& .EmojiPickerReact": {
            "--epr-emoji-size": "1.3rem",
          },
        }}
      >
        <EmojiPicker
          onEmojiClick={(emojiObject) => {
            messageInputRef.current!.value += emojiObject.emoji;
          }}
          skinTonesDisabled
          lazyLoadEmojis
          height={"370px"}
          width="100%"
          previewConfig={{ showPreview: false }}
        />
      </Box>
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
                    onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
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
  );
};
