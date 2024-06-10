import { TextWithEmojis } from "@/package/utils";
import { Typography } from "@mui/material";

interface Props {
  body: string;
}

export const BodyMessage = ({ body }: Props) => {
  return (
    <Typography
      variant={"body2"}
      sx={{
        overflowWrap: "break-word",
      }}
    >
      <TextWithEmojis text={body} />
    </Typography>
  );
};
