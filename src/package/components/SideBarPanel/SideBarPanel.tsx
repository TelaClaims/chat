import Styles from "./styles";
import { Box, IconButton, Typography } from "@mui/material";
import { SideBarProps } from "@/package/types";
import { ConversationsPanel } from "./ConversationsPanel/ConversationsPanel";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSideBar } from "@/package/context/SideBarPanel/context";

export const SideBarPanel = ({ styles }: SideBarProps) => {
  const { open, openSideBar, closeSideBar } = useSideBar();

  return (
    <Styles.SideBarPanel>
      <Styles.Container styles={styles} isOpen={open} boxShadow={3}>
        <Box display={"flex"} flexDirection={"column"} height={"100%"}>
          {open ? (
            <Box
              display={"flex"}
              p={1}
              justifyContent={"space-between"}
              alignItems={"center"}
              borderBottom={"1px solid #ccc"}
              minHeight={"42px"}
            >
              <Typography variant={"h6"}>Conversations</Typography>
              <IconButton onClick={closeSideBar}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
          ) : (
            <Box
              display={"flex"}
              justifyContent={"end"}
              p={1}
              borderBottom={"1px solid #ccc"}
              minHeight={"42px"}
            >
              <IconButton onClick={openSideBar}>
                <ChevronLeftIcon />
              </IconButton>
            </Box>
          )}
          <ConversationsPanel />
        </Box>
      </Styles.Container>
    </Styles.SideBarPanel>
  );
};
