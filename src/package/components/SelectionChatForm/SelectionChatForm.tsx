import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  colors,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

export const SelectionChatForm = () => {
  const { selectionMode } = useChat();
  const [openDeleteSelectedMessagesModal, setOpenDeleteSelectedMessagesModal] =
    useState(false);

  return (
    <>
      <Box
        height={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={2}
        px={1}
        sx={{
          borderTop: `1px solid ${colors.grey["300"]}`,
        }}
      >
        <Box display={"flex"}>
          <IconButton
            color="error"
            onClick={() => setOpenDeleteSelectedMessagesModal(true)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
        <Typography variant="body2">
          {selectionMode.selectedMessages.length} selected
        </Typography>
      </Box>
      <DeleteSelectedMessagesModal
        open={openDeleteSelectedMessagesModal}
        handleClose={() => setOpenDeleteSelectedMessagesModal(false)}
      />
    </>
  );
};

interface DeleteSelectedMessagesModalProps {
  open: boolean;
  handleClose: () => void;
}

const DeleteSelectedMessagesModal = ({
  handleClose,
  open,
}: DeleteSelectedMessagesModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteSelectedMessages, resetSelectionMode } = useChatDispatch();

  const handleDeleteSelectedMessages = async () => {
    setIsDeleting(true);
    await deleteSelectedMessages();
    setIsDeleting(false);
    resetSelectionMode();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Delete Selected Messages</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to delete the selected message(s)? Please note
          that only your own messages can be deleted.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Box display={"flex"} gap={1}>
          <Button onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteSelectedMessages}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Delete"
            )}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
