import { Box } from "@mui/material";
interface Props {
  onClick?: () => void;
}

export const MessageBackdrop = ({ onClick }: Props) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        backdropFilter: "blur(3px)",
        display: "flex",
      }}
    />
  );
};
