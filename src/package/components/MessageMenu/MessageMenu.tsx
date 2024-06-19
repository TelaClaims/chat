import {
  ButtonGroup,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Tooltip,
  colors,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import { ContextMenuItem, DefaultContextMenuOptions } from "@/package/types";

interface Props {
  onClickOption: (reason: DefaultContextMenuOptions) => void;
  onClickExtendedOption: (extendedOption: ContextMenuItem) => void;
  hiddenOptions?: DefaultContextMenuOptions[];
  extendedContextMenu?: ContextMenuItem[];
}

interface MSGMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  handleClose: () => void;
  handleClickOptionMenu: (reason: DefaultContextMenuOptions) => void;
  handleClickExtendedOptionMenu: (extendedOption: ContextMenuItem) => void;
  hiddenOptions?: DefaultContextMenuOptions[];
  extendedContextMenu?: ContextMenuItem[];
}

export const MessageMenu = ({
  onClickOption,
  onClickExtendedOption,
  hiddenOptions,
  extendedContextMenu,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOption = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    reason: "edit" | "select"
  ) => {
    event.preventDefault();
    onClickOption(reason);
  };

  const handleClickOptionMenu = (reason: DefaultContextMenuOptions) => {
    onClickOption(reason);
  };

  const handleClickExtendedOptionMenu = (extendedOption: ContextMenuItem) => {
    onClickExtendedOption(extendedOption);
  };

  const hideEdit = hiddenOptions?.includes("edit");

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
      <Tooltip title="Select" placement="top">
        <IconButton
          size="small"
          aria-label="select"
          onClick={(e) => handleClickOption(e, "select")}
        >
          <SelectAllIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {!hideEdit && (
        <Tooltip title="Edit" placement="top">
          <IconButton
            size="small"
            aria-label="edit"
            onClick={(e) => handleClickOption(e, "edit")}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="More" placement="top">
        <IconButton
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          size="small"
          aria-label="edit"
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <MSGMenu
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
        handleClickOptionMenu={handleClickOptionMenu}
        handleClickExtendedOptionMenu={handleClickExtendedOptionMenu}
        hiddenOptions={hiddenOptions}
        extendedContextMenu={extendedContextMenu}
      />
    </ButtonGroup>
  );
};

export const MSGMenu = ({
  anchorEl,
  open,
  handleClose,
  handleClickOptionMenu,
  handleClickExtendedOptionMenu,
  hiddenOptions,
  extendedContextMenu,
}: MSGMenuProps) => {
  const handleClickOption = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    reason: DefaultContextMenuOptions
  ) => {
    event.preventDefault();
    handleClickOptionMenu(reason);
    handleClose();
  };

  const handleClickExtendedOption = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    extendedOption: ContextMenuItem
  ) => {
    event.preventDefault();
    handleClickExtendedOptionMenu(extendedOption);
    handleClose();
  };

  const hideEdit = hiddenOptions?.includes("edit");
  const hideCopy = hiddenOptions?.includes("copy");
  const hideDelete = hiddenOptions?.includes("delete");

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
      sx={{
        ".MuiMenu-paper": {
          bgcolor: colors.grey["300"],
        },
      }}
    >
      <Paper
        sx={{
          width: 240,
          maxWidth: "100%",
          bgcolor: colors.grey["300"],
          px: 1,
        }}
        elevation={0}
      >
        <MenuList
          sx={{
            padding: 0,
          }}
        >
          {extendedContextMenu?.map((item) => (
            <MenuItem
              key={item.key}
              onClick={(e) => handleClickExtendedOption(e, item)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: colors.grey["800"],
                transition: "all 0.1s ease-in-out",
                ":hover": {
                  color: colors.common.white,
                  bgcolor: colors.grey["600"],
                },
              }}
            >
              <ListItemText>{item.label}</ListItemText>
              <ListItemIcon
                sx={{
                  justifyContent: "flex-end",
                  color: "inherit",
                }}
              >
                {item.Icon}
              </ListItemIcon>
            </MenuItem>
          ))}

          <MenuItem
            onClick={(e) => handleClickOption(e, "select")}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: colors.grey["800"],
              transition: "all 0.1s ease-in-out",
              ":hover": {
                color: colors.common.white,
                bgcolor: colors.grey["600"],
              },
            }}
          >
            <ListItemText>Select</ListItemText>
            <ListItemIcon
              sx={{
                justifyContent: "flex-end",
                color: "inherit",
              }}
            >
              <SelectAllIcon fontSize="small" color="inherit" />
            </ListItemIcon>
          </MenuItem>

          {!hideCopy && (
            <MenuItem
              onClick={(e) => handleClickOption(e, "copy")}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: colors.grey["800"],
                transition: "all 0.1s ease-in-out",
                ":hover": {
                  color: colors.common.white,
                  bgcolor: colors.grey["600"],
                },
              }}
            >
              <ListItemText>Copy Text</ListItemText>
              <ListItemIcon
                sx={{
                  justifyContent: "flex-end",
                  color: "inherit",
                }}
              >
                <ContentCopyIcon fontSize="small" color="inherit" />
              </ListItemIcon>
            </MenuItem>
          )}

          {!hideEdit && (
            <MenuItem
              onClick={(e) => handleClickOption(e, "edit")}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: colors.grey["800"],
                transition: "all 0.1s ease-in-out",
                ":hover": {
                  color: colors.common.white,
                  bgcolor: colors.grey["600"],
                },
              }}
            >
              <ListItemText>Edit Message</ListItemText>
              <ListItemIcon
                sx={{
                  justifyContent: "flex-end",
                  color: "inherit",
                }}
              >
                <EditIcon fontSize="small" color="inherit" />
              </ListItemIcon>
            </MenuItem>
          )}

          {!hideDelete && (
            <MenuItem
              onClick={(e) => handleClickOption(e, "delete")}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: colors.red["600"],
                transition: "all 0.1s ease-in-out",
                ":hover": {
                  color: colors.common.white,
                  bgcolor: colors.red["600"],
                },
              }}
            >
              <ListItemText>Delete Message</ListItemText>
              <ListItemIcon
                sx={{
                  justifyContent: "flex-end",
                  color: "inherit",
                }}
              >
                <DeleteIcon fontSize="small" color="inherit" />
              </ListItemIcon>
            </MenuItem>
          )}
        </MenuList>
      </Paper>
    </Menu>
  );
};
