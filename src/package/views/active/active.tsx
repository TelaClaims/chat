import { ActionButton } from "@/package/components";
import { useChatDispatch } from "@/package/context/Chat/context";
import { Stack } from "@/package/layouts/Stack";
import ForumIcon from "@mui/icons-material/Forum";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";

const ActiveView = () => {
  const { setView } = useChatDispatch();

  return (
    <Stack>
      <Stack.Segment
        flex={0.7}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <ForumIcon sx={{ fontSize: "10rem" }} color="disabled" />
      </Stack.Segment>
      <Stack.Segment flex={0.3}>
        <ActionButton
          color="primary"
          onClick={() => setView("lookup")}
          icon={<RateReviewOutlinedIcon fontSize="large" />}
        />
      </Stack.Segment>
    </Stack>
  );
};
export default ActiveView;
