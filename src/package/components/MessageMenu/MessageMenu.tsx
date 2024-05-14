import { ButtonGroup, IconButton, Tooltip, colors } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

interface Props {
  onClickOption: (reason: "edit") => void;
}

export const MessageMenu = ({ onClickOption }: Props) => {
  const handleClickOption = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    reason: "edit"
  ) => {
    event.preventDefault();
    onClickOption(reason);
  };

  return (
    <ButtonGroup
      size="small"
      variant="contained"
      sx={{
        position: "absolute",
        top: -16,
        bgcolor: colors.grey["300"],
        opacity: 0.8,
      }}
    >
      <Tooltip title="Edit" placement="top">
        <IconButton
          size="small"
          aria-label="edit"
          onClick={(e) => handleClickOption(e, "edit")}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="More" placement="top">
        <IconButton size="small" aria-label="edit">
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </ButtonGroup>
  );
};
