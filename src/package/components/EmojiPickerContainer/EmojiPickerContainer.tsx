import { Box } from "@mui/material";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface Props {
  isOpen: boolean;
  onEmojiClick: (emojiObject: EmojiClickData) => void;
}

export const EmojiPickerContainer = ({ isOpen, onEmojiClick }: Props) => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 55,
        right: 0,
        left: 0,
        maxHeight: isOpen ? "370px" : "0px",
        overflow: "hidden",
        transition: "max-height 0.2s ease",
        "& .EmojiPickerReact": {
          "--epr-emoji-size": "1.3rem",
        },
      }}
    >
      <EmojiPicker
        onEmojiClick={onEmojiClick}
        skinTonesDisabled
        lazyLoadEmojis
        height={"370px"}
        width="100%"
        previewConfig={{ showPreview: false }}
      />
    </Box>
  );
};
