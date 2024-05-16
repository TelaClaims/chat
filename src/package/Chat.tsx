import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { ThemeProvider, createTheme } from "@mui/material";
import Layout from "./layouts/Layout";
import ErrorBoundary from "./layouts/ErrorBoundary";
import { AlertSnackBar, SideBarPanel, Status } from "./components";
import { ContainerStyles } from "./components/Container/styles";
import { Main } from "./layouts/Main";
import { useEffect } from "react";
import { useChat, useChatDispatch } from "./context/Chat/context";
import { ContactInput, Events, Handlers } from "./types";

const theme = createTheme();

interface ChatProps {
  contact: ContactInput;
  events: Events;
  handlers?: Handlers;
  styles?: ContainerStyles;
  showStatus?: boolean;
}

const Chat = ({
  contact,
  showStatus = true,
  handlers,
  events,
  styles,
}: ChatProps) => {
  const { view } = useChat();
  const { initializeChat, setAlert } = useChatDispatch();

  useEffect(() => {
    if (!contact.identity) {
      setAlert({
        type: "error",
        severity: "critical",
        message: "Identity is required to initialize the Chat.",
        context: `The identity is required. When Initializing the Chat.`,
      });
    } else {
      initializeChat({
        contact,
        events,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact.identity]);

  return (
    <ThemeProvider theme={theme}>
      <Layout styles={styles}>
        <ErrorBoundary>
          <Main handlers={handlers} />
          {showStatus && view !== "on-chat" && <Status />}
        </ErrorBoundary>
        {false && <SideBarPanel />}
        <AlertSnackBar />
      </Layout>
    </ThemeProvider>
  );
};

export default Chat;
