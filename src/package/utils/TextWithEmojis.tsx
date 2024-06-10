import React from "react";
import { Box } from "@mui/material";
import { Emoji } from "emoji-picker-react";
import emojiRegex from "emoji-regex";
import { v4 as uuidv4 } from "uuid";

function emojiUnicode(emoji: string) {
  if (emoji.length === 1) {
    return emoji.charCodeAt(0).toString(16);
  }

  const comp =
    (emoji.charCodeAt(0) - 0xd800) * 0x400 +
    (emoji.charCodeAt(1) - 0xdc00) +
    0x10000;

  return comp >= 0 ? comp.toString(16) : emoji.charCodeAt(0).toString(16);
}

export const TextWithEmojis = React.memo(({ text }: { text: string }) => {
  const regex = emojiRegex();
  const parts = text.split(regex);
  const matches = text.match(regex);

  if (!matches) return <>{text}</>;

  const elements: React.ReactNode[] = [];

  parts.forEach((part, index) => {
    if (part) {
      elements.push(
        <Box component="span" key={`text-${uuidv4()}`}>
          {part}
        </Box>
      );
    }

    if (matches[index]) {
      elements.push(
        <Box
          component="span"
          key={`emoji-${uuidv4()}`}
          display="inline-block"
          style={{ verticalAlign: "bottom" }}
        >
          <Emoji unified={emojiUnicode(matches[index])} size={24} lazyLoad />
        </Box>
      );
    }
  });

  return <React.Fragment>{elements}</React.Fragment>;
});
