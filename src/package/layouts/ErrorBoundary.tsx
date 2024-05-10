import { Box, Typography } from "@mui/material";
import Layout from "./Layout";
import { log } from "../utils";
import { useChat } from "../context/Chat/context";

interface Props {
  children: React.ReactNode;
}

export const ErrorBoundary = ({ children }: Props) => {
  const { alert } = useChat();

  if (alert?.type === "error" && alert?.severity === "critical") {
    log("error", alert);
    return (
      <Layout.View>
        <Box
          height={"100%"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant="h6" color="gray">
            Unable to initialize the Chat
          </Typography>
        </Box>
      </Layout.View>
    );
  }

  return <>{children}</>;
};
export default ErrorBoundary;
