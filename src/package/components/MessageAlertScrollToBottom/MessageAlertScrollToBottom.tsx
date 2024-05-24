import { Box, IconButton, colors } from "@mui/material";
import { ArrowDownward as ArrowDownwardIcon } from "@mui/icons-material";

interface Props {
  show: boolean;
  onClick: () => void;
}

export const MessageAlertScrollToBottom = ({ show, onClick }: Props) => {
  return (
    <Box
      position={"absolute"}
      bottom={0}
      right={16}
      sx={{
        transform: show ? "translateY(0%)" : "translateY(-200%)",
        transition:
          "transform 0.2s cubic-bezier(0.42, 0, 1, 1) 0.5s, opacity 0.2s cubic-bezier(0.42, 0, 1, 1)",
        opacity: 0.5,
        ":hover": {
          opacity: 1,
        },
      }}
    >
      <IconButton
        onClick={onClick}
        color="info"
        sx={{
          bgcolor: colors.grey["200"],
        }}
      >
        <ArrowDownwardIcon />
      </IconButton>
    </Box>
  );
};
