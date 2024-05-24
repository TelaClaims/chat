import Styles from "./styles";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { SideBarOption, SideBarProps } from "@/package/types";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Fragment, useEffect } from "react";
import { useSideBar } from "@/package/context/SideBarPanel/context";
import GroupsIcon from "@mui/icons-material/Groups";
import { ConversationsPanel } from "./ConversationsPanel/ConversationsPanel";
import { useChat } from "@/package/context/Chat/context";

export const SideBarPanel = ({ styles, options }: SideBarProps) => {
  const { client } = useChat();
  const { open, activePanel, closeSideBar, updateOptions, openSideBar } =
    useSideBar();

  const defaultOption: SideBarOption = {
    id: "conversations",
    title: "Conversations",
    component: (
      <IconButton
        disabled={client?.connectionState !== "connected"}
        onClick={() => openSideBar("conversations")}
      >
        <GroupsIcon />
      </IconButton>
    ),
    panelComponent: <ConversationsPanel />,
    position: "top",
  };

  useEffect(() => {
    updateOptions([defaultOption, ...(options || [])]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.length]);

  const topOptions =
    options?.filter((option) => option.position !== "bottom") || [];
  const bottomOptions = options?.filter(
    (option) => option.position === "bottom"
  );

  topOptions.unshift(defaultOption);

  return (
    <Styles.SideBarPanel>
      <Styles.Container styles={styles} isOpen={open} boxShadow={3}>
        {open ? (
          <Box display={"flex"} flexDirection={"column"} m={2} height={"100%"}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography variant={"h6"}>{activePanel?.title}</Typography>
              <IconButton aria-label={"toggle close"} onClick={closeSideBar}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
            <Divider />
            <Box height={"100%"}>{activePanel?.panelComponent}</Box>
          </Box>
        ) : (
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
            height={"100%"}
          >
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"start"}
              m={1.5}
            >
              {topOptions?.map((option) => (
                <Fragment key={option.id}>{option.component}</Fragment>
              ))}
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"start"}
              m={1.5}
            >
              {bottomOptions?.map((option) => (
                <Fragment key={option.id}>{option.component}</Fragment>
              ))}
            </Box>
          </Box>
        )}
      </Styles.Container>
    </Styles.SideBarPanel>
  );
};
