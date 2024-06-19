import { Box } from "@mui/material";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import React from "react";

interface Props {
  isOpen: boolean;
  onEmojiClick: (emojiObject: EmojiClickData) => void;
}

const areEqual = (prevProps: Props, nextProps: Props) => {
  return prevProps.isOpen === nextProps.isOpen;
};

export const EmojiPickerContainer = React.memo(
  ({ isOpen, onEmojiClick }: Props) => {
    return (
      <Box
        sx={{
          position: "absolute",
          bottom: 55,
          right: 0,
          left: 0,
          overflow: "hidden",
          "& .EmojiPickerReact": {
            "--epr-emoji-size": "1.3rem",
          },
        }}
      >
        <EmojiPicker
          open={isOpen}
          onEmojiClick={onEmojiClick}
          skinTonesDisabled
          height={"370px"}
          width="100%"
          previewConfig={{ showPreview: false }}
        />
      </Box>
    );
  },
  areEqual
);
